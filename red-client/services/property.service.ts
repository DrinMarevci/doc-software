import { API_URL, HEADERS } from '@/constants/api'

interface GetAllPropertyResponse {}

export const PropertyService = {
  getAll: async (): Promise<GetAllPropertyResponse> => {
    try {
      const result = await fetch(`${API_URL}/api/property`, {
        method: 'GET',
        headers: HEADERS,
      })

      if (!result.ok) throw Error(result.statusText)

      const data = await result.json()

      return data
    } catch (error) {
      throw Error((error as Error).message)
    }
  },

  get: async () => {},

  create: async () => {},

  update: async () => {},

  delete: async () => {},
}
