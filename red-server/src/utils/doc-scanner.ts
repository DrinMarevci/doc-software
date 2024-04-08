import pdf, { type Result } from 'pdf-parse'
import { type UploadedFile } from 'express-fileupload'
import { type PropertyDocument } from '../types/docs'

export async function getPdfFileResult(file: UploadedFile): Promise<Result> {
  const data = await pdf(file.data)

  console.log('----- result start ----')
  const try1 = extractValuesFromLeaseAbstract(data.text)
  if (!!!try1) {
    extractValuesFromLease(data.text)
  }
  console.log('----- result end ----')

  return data
}

export function extractValuesFromLeaseAbstract(leaseAbstract: string): any {
  try {
    // const values: PropertyDocument = {}
    const values: any = {}

    const startMarker = 'TENANT LEASE ABSTRACT'
    const markerString = '[date|req|signer1]'
    const endMarker = 'Doc ID: '

    const startIndex = leaseAbstract.indexOf(startMarker)
    if (startIndex === -1) return

    const markerIndex = leaseAbstract.indexOf(markerString, startIndex)
    if (markerIndex === -1) return

    const endIndex = leaseAbstract.indexOf(endMarker, markerIndex)
    if (endIndex === -1) return

    const infoString = leaseAbstract
      .substring(markerIndex + markerString.length, endIndex)
      .trim()

    const rawDataArray = infoString.split('\n')

    console.log({ infoString, rawDataArray })

    values.tenants = rawDataArray[0].split(', ')
    values.unitAddress = rawDataArray[1]
    values.email = rawDataArray[2]
    values.alternateEmail = rawDataArray[3]
    values.residentAddress = rawDataArray[4]
    values.residentAddress2 = rawDataArray[5]
    values.cellPhone = rawDataArray[6]
    values.alternatePhone = rawDataArray[7]
    values.property = rawDataArray[8]
    values.unit = rawDataArray[9]
    values.lateFeesBaseAmount = rawDataArray[10]
    values.lateFeesGracePeriod = rawDataArray[11]
    values.rentAmount = parseFloat(rawDataArray[12].replace('$', ''))
    values.securityDepositAmount = parseFloat(rawDataArray[13].replace('$', ''))
    values.leaseEndDate = new Date(rawDataArray[14])
    values.leaseStartDate = new Date(rawDataArray[15])
    values.leaseSignDate = new Date(rawDataArray[16])

    console.log({ values })

    return values
  } catch (error) {
    return
  }
}

export function extractValuesFromLease(documentContent: string): any {
  try {
    // const values: PropertyDocument = {}
    const values: any = {}

    const startMarker = 'TENANT LEASE ABSTRACT'
    const markerString = '[date|req|signer1]'
    const endMarker = 'Doc ID: '

    const startIndex = documentContent.indexOf(startMarker)
    if (startIndex === -1) return

    const markerIndex = documentContent.indexOf(markerString, startIndex)
    if (markerIndex === -1) return

    const endIndex = documentContent.indexOf(endMarker, markerIndex)
    if (endIndex === -1) return

    const infoString = documentContent
      .substring(markerIndex + markerString.length, endIndex)
      .trim()

    const rawDataArray = infoString.split('\n')

    console.log({ infoString, rawDataArray })

    values.tenants = rawDataArray[0].split(', ')
    values.unitAddress = rawDataArray[1]
    values.email = rawDataArray[2]
    values.alternateEmail = rawDataArray[3]
    values.residentAddress = rawDataArray[4]
    values.residentAddress2 = rawDataArray[5]
    values.cellPhone = rawDataArray[6]
    values.alternatePhone = rawDataArray[7]
    values.property = rawDataArray[8]
    values.unit = rawDataArray[9]
    values.lateFeesBaseAmount = rawDataArray[10]
    values.lateFeesGracePeriod = rawDataArray[11]
    values.rentAmount = parseFloat(rawDataArray[12].replace('$', ''))
    values.securityDepositAmount = parseFloat(rawDataArray[13].replace('$', ''))
    values.leaseEndDate = new Date(rawDataArray[14])
    values.leaseStartDate = new Date(rawDataArray[15])
    values.leaseSignDate = new Date(rawDataArray[16])

    console.log({ values })

    return values
  } catch (error) {
    return
  }
}
