import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
import {
  companyDepartmentIdSchema,
  getCompanyDepartmentByCompIdSchema,
  toggleCompanyDepartmentSchema,
  updateCompanyDepartmentSchema,
} from '../schema/companyDepartment.schema'

export const getAllCompanyDepartment: RequestHandler = async (req, res, next) => {
  try {
    const companyDepartment = await prisma.companyDepartments.findMany()

    res.status(200).json({ data: companyDepartment })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const getCompanyDepartmentById: RequestHandler = async (req, res, next) => {
  const validatedId = companyDepartmentIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const companyDepartment = await prisma.companyDepartments.findUnique({
      where: {
        cdId: validatedId.data.id,
      },
    })

    if (!companyDepartment) {
      return res.status(404).json({ message: 'companyDepartment not found' })
    }

    res.status(200).json({ data: companyDepartment })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const getCompanyDepartmentByCompId: RequestHandler = async (req, res, next) => {
  const validatedId = getCompanyDepartmentByCompIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const companyDepartment = await prisma.companyDepartments.findMany({
      where: {
        cdCompId: validatedId.data.compId,
      },
    })

    if (!companyDepartment || companyDepartment.length < 1) {
      return res.status(404).json({ message: 'companyDepartment not found' })
    }

    res.status(200).json({ data: companyDepartment })
  } catch (err) {
    // TODO: Handle errors
  }
}
export const updateCompanyDepartmentById: RequestHandler = async (req, res) => {
  const validatedBody = updateCompanyDepartmentSchema.safeParse({
    ...req.body,
    cdId: req.params.cdId,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const companyDepartment = await prisma.companyDepartments.update({
      where: { cdId: req.params.cdId },
      data: {
        ...validatedBody.data,
      },
    })
    return res.status(200).json({ data: companyDepartment })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'User already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Foreign key does not exist' })
        case 'P2025':
          return res.status(400).json({ message: 'User to update not found' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const toggleCompanyDepartmentById: RequestHandler = async (req, res) => {
  const validatedBody = toggleCompanyDepartmentSchema.safeParse({
    cdId: req.params.cdId,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const currentcompanyDepartment = await prisma.companyDepartments.findUnique({
      where: { cdId: validatedBody.data.cdId },
    })
    const companyDepartment = await prisma.companyDepartments.update({
      where: { cdId: validatedBody.data.cdId },
      data: {
        cdIsActive: !currentcompanyDepartment?.cdIsActive,
      },
    })
    return res.status(200).json({ data: companyDepartment })
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}
