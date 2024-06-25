import type { Companies, Departments, UserRoles, Users } from '@prisma/client'

declare module 'express-session' {
  interface SessionData {
    user: Omit<
      Users & {
        role: UserRoles
        comp: Companies
        dept: Departments
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
            comp: Companies
            dept: Departments
          },
          'userPassword'
        >
      }
    }
  }
}
