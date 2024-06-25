import type { CompanyDepartments, UserRoles, Users } from '@prisma/client'

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
      }
    }
  }
}
