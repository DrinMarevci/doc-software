import { type UploadedFile } from 'express-fileupload'
import { type PropertyDocumentExtractedKeywords } from './types'

import path from 'path'
import fs from 'fs'
import { convert } from 'pdf-img-convert'
import { createWorker } from 'tesseract.js'
import {
  getTerminationDates,
  getCommencementDate,
  getRentAndDepositDetails,
  getTenants,
  getUnit,
  getUnitAddress,
} from './keyword-finder'

export async function getPdfFileResult(file: UploadedFile): Promise<{
  pdfContent: string
  keywordsMap: Partial<PropertyDocumentExtractedKeywords>
}> {
  let keywordsMap: Partial<PropertyDocumentExtractedKeywords> = {}

  const outputPath = await covnertPdfToImage(file)
  const pdfContent = await getImageTextAndDelete(outputPath)

  console.log(pdfContent)

  try {
    keywordsMap['unit'] = getUnit(file.name)
  } catch {}

  try {
    keywordsMap['tenants'] = getTenants(pdfContent)
  } catch {}

  try {
    keywordsMap['unitAddress'] = getUnitAddress(pdfContent)
  } catch {}

  try {
    keywordsMap = { ...keywordsMap, ...getRentAndDepositDetails(pdfContent) }
  } catch {}

  try {
    keywordsMap.commencementDate = getCommencementDate(pdfContent)
  } catch {}

  try {
    keywordsMap = {
      ...keywordsMap,
      ...getTerminationDates(pdfContent),
    }
  } catch {}

  console.log(keywordsMap)

  return { pdfContent, keywordsMap }
}

async function covnertPdfToImage(pdfFile: UploadedFile): Promise<string> {
  const PAGES_TO_CONVERT = 1
  const pdfPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    pdfFile.name
  )
  const outputPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'pdf-images',
    pdfFile.name.replace('.pdf', '')
  )

  pdfFile.mv(pdfPath, async (err: any) => {
    if (err) throw Error(err)

    if (!fs.existsSync(outputPath))
      fs.mkdirSync(outputPath, { recursive: true })

    const outputImages = await convert(pdfPath, {
      width: 2160,
      height: 3840,
      page_numbers: [1],
    })

    for (let i = 0; i < PAGES_TO_CONVERT; i++) {
      if (!!!outputImages[i]) continue
      fs.writeFileSync(path.join(outputPath, `${i}.png`), outputImages[i])
    }

    fs.unlinkSync(pdfPath)
  })

  return outputPath
}

async function getImageTextAndDelete(directoryPath: string): Promise<string> {
  const worker = await createWorker('eng')
  let result = ''

  const ocrPromises = fs.readdirSync(directoryPath).map(async (file, index) => {
    const {
      data: { text },
    } = await worker.recognize(`${directoryPath}/${file}`)
    return text
  })

  const ocrResults = await Promise.all(ocrPromises)

  await worker.terminate()
  deleteDirectory(directoryPath)
  result = ocrResults.join(' ')
  return result
}

function deleteDirectory(directoryPath: string): void {
  if (fs.existsSync(directoryPath)) {
    const files = fs.readdirSync(directoryPath)

    for (const file of files) {
      const filePath = `${directoryPath}/${file}`

      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath)
      } else {
        deleteDirectory(filePath)
      }
    }

    fs.rmdirSync(directoryPath)
  }
}
