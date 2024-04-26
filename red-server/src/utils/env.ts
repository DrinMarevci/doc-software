import dotenv from 'dotenv'

dotenv.config()

type EnvVariables = {
  PORT: string | number
  CORS_ORIGIN: string
  URL: string
}

export const { PORT, CORS_ORIGIN, URL } = process.env as EnvVariables
