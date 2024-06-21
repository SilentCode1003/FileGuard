import 'dotenv/config'
import { z } from 'zod'

// Don't forget to add env variables
const envSchema = z.object({
  NODE_ENV: z.string(),
  SERVER_PORT: z.coerce.number(),
  SERVER_SESSION_SECRET: z.string(),
  SERVER_IS_HTTPS: z.string().transform((value) => (value === 'true' ? true : false)),
  SERVER_LOGGING_LEVEL: z.enum(['fatal', 'error', 'warn', 'http', 'info', 'debug', 'trace']),
  CLIENT_ORIGIN: z.string(),
  DATABASE_URL: z.string(),
  MONGODB_URL: z.string(),
  FILE_SERVER: z.string(),
  IS_FILE_SERVER: z.string().transform((value) => (value ==='true' ? true : false)),
})

const validatedEnv = envSchema.safeParse(process.env)

if (!validatedEnv.success) {
  throw new Error(JSON.stringify(validatedEnv.error.flatten().fieldErrors))
}

export const CONFIG = {
  NODE_ENV: validatedEnv.data.NODE_ENV,
  SERVER_PORT: validatedEnv.data.SERVER_PORT,
  SERVER_SESSION_SECRET: validatedEnv.data.SERVER_SESSION_SECRET,
  SERVER_IS_HTTPS: validatedEnv.data.SERVER_IS_HTTPS,
  SERVER_LOGGING_LEVEL: validatedEnv.data.SERVER_LOGGING_LEVEL,
  CLIENT_ORIGIN: validatedEnv.data.CLIENT_ORIGIN,
  MONGODB_URL: validatedEnv.data.MONGODB_URL,
  FILE_SERVER: validatedEnv.data.FILE_SERVER,
  IS_FILE_SERVER: validatedEnv.data.IS_FILE_SERVER,
} as const
