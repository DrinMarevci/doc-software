import { type LeaseRenewalRentAndDepositDetails } from './types'

export function getUnit(pdfFileName: string): string {
  let unit = ''
  const partsDividedByDash = pdfFileName.split('-')
  if (partsDividedByDash.length > 0 && !!partsDividedByDash[0])
    unit = partsDividedByDash[0].replaceAll(' ', '')

  return unit
}

export function getTenants(pdfContent: string): string[] {
  let tenants: string[] = []

  const markerString = 'Name and Address'
  const markerRegexPattern = new RegExp(
    `${markerString}[^\n\r]*[\n\r]+([A-Z& ]+)[^A-Z]*`,
    'i'
  )
  const markerMatch = pdfContent.match(markerRegexPattern)

  if (markerMatch && markerMatch[1]) {
    if (markerMatch[1].includes('&')) {
      const words = markerMatch[1].split(' ')
      if (words.length > 3)
        tenants = [`${words[0]} ${words[3]}`, `${words[2]} ${words[3]}`]
    } else {
      const words = markerMatch[1].split(' ')
      if (words.length > 1) tenants = [`${words[0]} ${words[1]}`]
    }
  }

  return tenants
}

export function getUnitAddress(pdfContent: string): string {
  let unitAddress = ''

  const markerString = 'Name and Address'
  const lines = pdfContent.split('\n')
  const markerIndex = lines.findIndex((line) => line.includes(markerString))

  if (markerIndex !== -1 && markerIndex + 5 < lines.length) {
    let location = ''
    let foundZipCodeDigit = false
    linesLoop: for (let i = 3; i <= 5; i++) {
      if (!isAllCaps(lines[markerIndex + i])) continue

      for (const char of lines[markerIndex + i].trim().split('')) {
        if (isNaN(parseInt(char)) && foundZipCodeDigit) break linesLoop
        if (!isNaN(parseInt(char))) foundZipCodeDigit = true
        location += char
      }
    }

    let address = ''
    const streetSuffixRegex =
      /(DRIVE|ST(REET)?|RD\.?|AV(E|ENUE)|LN\.?|BOUL(EVARD)?|CT\.?|PL(ACE)?|CIR(CLE)?|WAY|TERR(ACE)?|PKWY?\.?|LOOP|HWY\.?)/i
    for (const part of lines[markerIndex + 2].trim().split(/\s+/)) {
      address += part + ' '
      if (streetSuffixRegex.test(part)) break
    }

    unitAddress = `${address.slice(0, -1)}, ${location}`
  }

  return unitAddress
}

export function getRentAndDepositDetails(
  pdfContent: string
): LeaseRenewalRentAndDepositDetails {
  const rentDetails = {
    oneYearRentAmount: 0,
    oneYearNewRentAmount: 0,
    oneYearGuidelineRate: 0,
    twoYearRentAmount: 0,
    twoYearNewRentAmount: 0,
    twoYearGuidelineRate: 0,
    securityDepositAmount: 0,
    oneYearAdditionalDepositAmount: 0,
    twoYearAdditionalDepositAmount: 0,
  }

  const depositMarker = 'Current Deposit:'
  const markerString = 'Tenant shall pay a monthly rent'
  const rentNumbersRegex = /\d+\.\d{2,}/g
  const lines = pdfContent.split('\n')
  const markerIndex = lines.findIndex((line) => line.includes(markerString))
  const depositMarkerIndex = lines.findIndex((line) =>
    line.includes(depositMarker)
  )

  // deposit
  if (depositMarkerIndex !== -1) {
    // one year additional deposit
    const oneYearAdditionalDepositMarker = 'Deposit Required - 1 year lease:'
    const splitLines = lines[depositMarkerIndex].split(
      oneYearAdditionalDepositMarker
    )
    if (!!splitLines && splitLines.length > 0) {
      let oneYearAdditionalDepositResult = splitLines[1]
        .replace('$', '')
        .replace(' ', '')

      // if ocr processor didn't find a decimal point
      if (!oneYearAdditionalDepositResult.includes('.')) {
        if (oneYearAdditionalDepositResult.length === 4) {
          oneYearAdditionalDepositResult =
            oneYearAdditionalDepositResult.substring(0, 2) +
            '.' +
            oneYearAdditionalDepositResult.substring(2)
        }
      }
      rentDetails.oneYearAdditionalDepositAmount = parseFloat(
        oneYearAdditionalDepositResult
      )
    }

    // two year additional deposit
    if (depositMarkerIndex + 1 < lines.length) {
      const twoYearAdditionalDepositMarker = 'Deposit Required - 2 year lease:'
      let twoYearAdditionalDepositResult = lines[depositMarkerIndex + 1]
        .split(twoYearAdditionalDepositMarker)[1]
        .replace('$', '')
        .replace(' ', '')
      if (!twoYearAdditionalDepositResult.includes('.')) {
        if (twoYearAdditionalDepositResult.length === 4) {
          twoYearAdditionalDepositResult =
            twoYearAdditionalDepositResult.substring(0, 2) +
            '.' +
            twoYearAdditionalDepositResult.substring(2)
        }
      }
      rentDetails.twoYearAdditionalDepositAmount = parseFloat(
        twoYearAdditionalDepositResult
      )
    }

    // deposit amount
    const matches = lines[depositMarkerIndex].match(rentNumbersRegex)
    if (matches) {
      rentDetails.securityDepositAmount = parseFloat(matches[0])
    }
  }

  // rent
  if (markerIndex !== -1) {
    const matches = lines[markerIndex].match(rentNumbersRegex)
    if (matches) {
      rentDetails.oneYearNewRentAmount = parseFloat(matches[0])
      rentDetails.twoYearNewRentAmount = parseFloat(matches[1])
    }
  }

  return rentDetails
}

export function getCommencementDate(pdfContent: string): Date {
  let date = ''

  const markerString = 'shall commence on'
  const lines = pdfContent.split('\n')
  const markerIndex = lines.findIndex((line) =>
    line.toLocaleLowerCase().includes(markerString)
  )

  if (markerIndex !== -1) {
    date = lines[markerIndex]
      .toLocaleLowerCase()
      .split(markerString)[1]
      .split(',')[0]
      .replaceAll(' ', '')
  }

  const dateParts = date.split('/')
  const year = parseInt(dateParts[2], 10)
  const month = parseInt(dateParts[0], 10) - 1
  const day = parseInt(dateParts[1], 10)

  return new Date(year, month, day)
}

export function getTerminationDates(pdfContent: string): {
  oneYearTerminationDate?: Date
  twoYearTerminationDate?: Date
} {
  let oneYearDate = ''
  let twoYearDate = ''

  const markerString = 'shall terminate on'
  const lines = pdfContent.split('\n')
  const markerIndex = lines.findIndex((line) =>
    line.toLocaleLowerCase().includes(markerString)
  )

  if (markerIndex !== -1) {
    oneYearDate = lines[markerIndex]
      .toLocaleLowerCase()
      .split(markerString)[1]
      .split('(')[0]
      .replaceAll(' ', '')
    twoYearDate = lines[markerIndex]
      .toLocaleLowerCase()
      .split(markerString)[1]
      .split('or')[1]
      .replaceAll(' ', '')
  }

  const oneYearDatePars = oneYearDate.split('/')
  const oneYearTerminationDate = new Date(
    parseInt(oneYearDatePars[2], 10),
    parseInt(oneYearDatePars[0], 10) - 1,
    parseInt(oneYearDatePars[1], 10)
  )
  const twoYearDatePars = twoYearDate.split('/')
  const twoYearTerminationDate = new Date(
    parseInt(twoYearDatePars[2], 10),
    parseInt(twoYearDatePars[0], 10) - 1,
    parseInt(twoYearDatePars[1], 10)
  )

  return {
    oneYearTerminationDate,
    twoYearTerminationDate,
  }
}

function isAllCaps(input: string): boolean {
  const regex = /^[A-Z\s]+$/
  const cleanedInput = input.replace(/\d/g, '').trim()
  return regex.test(cleanedInput)
}
