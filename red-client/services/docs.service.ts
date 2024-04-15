import { API_URL, HEADERS } from '@/constants/api'
import { type PropertyDocumentExtractedKeywords } from '@/types/property'

interface GetPdfContentResponse {
  pdfContent: string
  documentData: Partial<PropertyDocumentExtractedKeywords>
}

export const DocumentsService = {
  getPdfContent: async (file: File): Promise<GetPdfContentResponse> => {
    try {
      const formData = new FormData()

      formData.append('pdfFile', file)

      const result = await fetch(`${API_URL}/api/docs/get-pdf-content`, {
        method: 'POST',
        headers: HEADERS,
        body: formData,
      })

      if (!result.ok) throw Error(result.statusText)

      const data = (await result.json()) as GetPdfContentResponse

      return data
    } catch (error) {
      throw Error((error as Error).message)
    }
  },
}
