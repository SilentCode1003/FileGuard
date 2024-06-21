import { PrismaClient } from '@prisma/client'
import { logger } from '../util/logger.util'

export const prisma = new PrismaClient()

prisma
  .$connect()
  .then(() => {
    logger.info('Prisma client successfully connected')
  })
  .catch((err) => {
    logger.error('Prisma client cannot connect', err)
  })
