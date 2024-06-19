import type { Users } from '@prisma/client'

declare module 'express-session' {
  interface SessionData {
    user?: Omit<Users, 'userPassword'>
  }
}

declare global {
  namespace Express {
    interface Request {
      context: {
        user: Omit<Users, 'userPassword'>
      }
    }
  }
}
