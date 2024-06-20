import type { RequestHandler } from 'express'
import { prisma } from '../db/prisma'
//import bcrypt from 'bcrypt'
import { nanoid } from '../util/nano.util'
import { createCompaniesSchema, companiesIdSchema, updateCompaniesSchema, toggleCompaniesSchema } from '../schema/companies.schema.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { log } from 'console'

export const getAllCompanies: RequestHandler = async (req, res, next) => {
  try {
    const companies = await prisma.companies.findMany()

    res.status(200).json({ data: companies })
  } catch (err) {
    // TODO: Handle errors
  }
}


export const createCompanies: RequestHandler = async (req, res, next) => {
  const validatedBody = createCompaniesSchema.safeParse(req.body)

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const companies = await prisma.companies.create({
      data: {
        ...validatedBody.data,
        compId: nanoid(),
      },
    })

    res.status(200).json({ data: companies })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'Company already exists' })
        case 'P2003':
          return res.status(400).json({ message: 'Foreign key does not exist' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

export const getCompaniesById: RequestHandler = async (req, res, next) => {
  const validatedId = companiesIdSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const companies = await prisma.companies.findUnique({
      where: {
        compId: validatedId.data.id,
      },
    })

    if (!companies) {
      return res.status(404).json({ message: 'Companies not found' })
    }

    res.status(200).json({ data: companies })
  } catch (err) {
    // TODO: Handle errors
  }
}

export const updateCompaniesById: RequestHandler = async (req, res) => {
  const validatedBody = updateCompaniesSchema.safeParse({
    ...req.body,
    compId: req.params.compId,
  })
  

  if (!validatedBody.success) {
    return res.status(400).json({ message: validatedBody.error.errors[0]?.message })
  }

  try {
    const companies = await prisma.companies.update({
      where: { compId: req.params.compId },
      data: {
        ...validatedBody.data,
        compName: validatedBody.data.compName,
      },
    })
    return res.status(200).json({ data: companies })
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

export const toggleCompaniesById: RequestHandler = async (req, res, next) => {
  const validatedId = toggleCompaniesSchema.safeParse(req.params)

  if (!validatedId.success) {
    return res.status(400).json({ message: validatedId.error.errors[0]?.message })
  }

  try {
    const currentCompanies = await prisma.companies.findUnique({
      where: {
        compId: validatedId.data.compId,
      },
    })

    if (!currentCompanies) {
      return res.status(404).json({ message: 'Companies not found' })
    }

    const companies = await prisma.companies.update({
      where: {
        compId: validatedId.data.compId,
      },
      data: {
        compIsActive: !currentCompanies.compIsActive,
      },
    })

    res.status(200).json({ data: companies })
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      switch (err.code) {
        case 'P2002':
          return res.status(400).json({ message: 'Company already exists' })
        case 'P2025':
          return res.status(400).json({ message: 'Company to toggle not found' })
        default:
          return res.status(400).json({ message: 'Prisma client error' })
      }
    }
  }
}

  
