import { Router } from 'express'

export const propertyApi = Router()
const propertyRoutePath = '/api/property'

propertyApi.post(`${propertyRoutePath}`, async (req, res) => {
  try {
    return res.json({ data: '' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: (error as Error).message })
  }
})
