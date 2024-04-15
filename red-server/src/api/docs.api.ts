import { Router } from 'express'
import { type UploadedFile } from 'express-fileupload'
import { getPdfFileResult } from '../lib/doc-scanner'

export const docsApi = Router()
const docsRoutePath = '/api/docs'

docsApi.post(`${docsRoutePath}/get-pdf-content`, async (req, res) => {
  if (!!!req.files && !!!(req?.files as { pdfFile: any } | null)?.pdfFile) {
    return res.status(400)
  }

  try {
    const { pdfContent, keywordsMap } = await getPdfFileResult(
      req.files!.pdfFile as UploadedFile
    )

    return res.json({
      pdfContent: pdfContent.text,
      documentData: keywordsMap,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: (error as Error).message })
  }
})
