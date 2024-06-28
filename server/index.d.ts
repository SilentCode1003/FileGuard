import type { CompanyDepartments, UserRoles, Users } from '@prisma/client'
import type { IncomingMessage } from 'http'
import type WebSocket from 'ws'

declare module 'express-session' {
  interface SessionData {
    user: Omit<
      Users & {
        role: UserRoles
        companyDepartment: CompanyDepartments
      },
      'userPassword'
    >
  }
}

declare global {
  namespace Express {
    interface Request {
      context: {
        user: Omit<
          Users & {
            role: UserRoles
            companyDepartment: CompanyDepartments
          },
          'userPassword'
        >
        wss: WebSocket.Server<typeof WebSocket.WebSocket, typeof IncomingMessage>
      }
    }
  }
}
