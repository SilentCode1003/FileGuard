import type { Express } from 'express'
import fs from 'node:fs'
import { serve, setup } from 'swagger-ui-express'
import YAML from 'yaml'

const file = fs.readFileSync('./src/docs/swagger.yaml', 'utf-8')
const swaggerDocument = YAML.parse(file)

export const initDocs = (app: Express) => {
  app.use('/api-docs', serve, setup(swaggerDocument))
}
