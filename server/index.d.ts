import type { Users } from '@prisma/client'

declare module 'express-session' {
  interface SessionData {
    user?: Omit<Users, 'userPassword'>
  }
}
