import cors from 'cors'
import fileUpload from 'express-fileupload'
import express, { type Router } from 'express'
import { createServer } from 'http'
import { CORS_ORIGIN } from './utils/env'

import { docsApi } from './api/docs.api'
import { propertyApi } from './api/property.api'

// Express app
export const app = express()
export const server = createServer(app)

app.use(express.json())
app.use(fileUpload())
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
)

// Init routes and apis
const routes: Router[] = [docsApi, propertyApi]
routes.forEach((route) => {
  app.use(route)
})
