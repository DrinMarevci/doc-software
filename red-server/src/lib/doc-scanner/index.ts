import pdf, { type Result } from 'pdf-parse'
import { type UploadedFile } from 'express-fileupload'
import {
  type PropertyDocumentExtractedKeywords,
  type PropertyDataKeys,
} from './types'
import { DOC_KEYWORDS } from './constants'

export async function getPdfFileResult(file: UploadedFile): Promise<{
  pdfContent: Result
  keywordsMap: Partial<PropertyDocumentExtractedKeywords>
}> {
  const pdfContent = await pdf(file.data)
  const keywords = Object.keys(DOC_KEYWORDS) as PropertyDataKeys[]
  const keywordsMap: Partial<PropertyDocumentExtractedKeywords> = {}

  for (let i = 0; i < keywords.length; i++) {
    const relatedKeywords = DOC_KEYWORDS[keywords[i]]
    let keywordValues: string[] = []

    for (let j = 0; j < relatedKeywords.regularExpressions.length; j++) {
      keywordValues = [
        ...keywordValues,
        ...(pdfContent.text
          .match(relatedKeywords.regularExpressions[j])
          ?.map((item) => item.toString()) || []),
      ]
    }

    keywordsMap[keywords[i]] = Array.from(new Set(keywordValues))
  }

  return { pdfContent, keywordsMap }
}
