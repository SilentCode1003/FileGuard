import type { RequestHandler } from 'express'
import { writeFile } from 'fs'
import { createFileSchema } from '../schema/files.schema'
import { prisma } from '../db/prisma'
import{ createFolder, decodeBase64ToFile} from '../util/customhelper.js'

import {CONFIG} from '../config/env.config.js'

export const getFile: RequestHandler = async (req, res) => {
  try {
    const files = await prisma.files.findMany({
      omit: {
        fileBase: true,
      },
    })
    return res.status(200).json({ data: files })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export const createFile: RequestHandler = async (req, res) => {
  const validatedBody = await createFileSchema.safeParseAsync({
    file: req.body.file,
    fileUserId: req.context.user!.userId,
    fileMimeType: req.body.fileMimeType,
    fileName: req.body.fileName,
  })

  if (!validatedBody.success) {
    return res.status(400).json({ error: validatedBody.error.errors })
  }

  try {
    const file = Buffer.from(validatedBody.data.file, 'base64')

    writeFile(`./root/${validatedBody.data.fileName}`, file, (err) => {
      if (err) throw err
      console.log('The file has been saved!')
    })

    return res.status(200).json({ message: 'File created' })
  } catch (err) {
    return res.status(500).json({ error: err })
  }
}

export const uploadFile: RequestHandler = async (req ,res) =>{
  try {
    const { filename, filecontent } = req.body;
    const targetFolder = `${CONFIG.IS_FILE_SERVER == true ? CONFIG.FILE_SERVER: "root"}/data`;
    let folders = filename.split("_");

    if (filename.includes("REV")) {
      console.log("File Revision detected!");
    }

    if (folders.length > 4) {
      console.log(folders[0], folders[1], folders[2], folders[3]);
      let companyFolder = `${targetFolder}/${folders[0]}`;
      let yearOrArchive = `${companyFolder}/${folders[1]}`;
      let departmentFolder = `${yearOrArchive}/${folders[2]}`;
      let documentTypeFolder = `${departmentFolder}/${folders[3]}`;

      createFolder(targetFolder);
      createFolder(companyFolder);
      createFolder(yearOrArchive);
      createFolder(departmentFolder);
      createFolder(documentTypeFolder);

      decodeBase64ToFile(filecontent, `${documentTypeFolder}/${filename}`);
    } else {
      console.log("Incorrect Fileame!", filename);
    }

    res.status(200).send({ msg: "Upload Success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: error });
  }
}