import { Router } from 'express'
import { type UploadedFile } from 'express-fileupload'
import {
  extractValuesFromLeaseAbstract,
  getPdfFileResult,
} from '../utils/doc-scanner'

export const docsApi = Router()
const docsRoutePath = '/api/docs'

docsApi.post(`${docsRoutePath}/get-pdf-content`, async (req, res) => {
  if (!!!req.files && !!!(req?.files as { pdfFile: any } | null)?.pdfFile) {
    return res.status(400)
  }

  try {
    const pdfContent = await getPdfFileResult(
      req.files!.pdfFile as UploadedFile
    )

    return res.json({
      pdfContent: pdfContent.text,
      documentData: extractValuesFromLeaseAbstract(pdfContent.text),
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: (error as Error).message })
  }
})
