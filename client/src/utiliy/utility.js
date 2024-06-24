export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]
      resolve(base64String)
    }
    reader.onerror = (error) => reject(error)
  })
}

export function splitPath(path) {
  const segments = path.split('/')
  return segments.map((segment, index) => {
    return {
      name: segment,
      path: segments.slice(0, index + 1).join('/'),
    }
  })
}

export function mergeData(files, folders) {
  if (!files || !folders) {
    return []
  }

  const refinedFiles = files.map((file) => ({
    name: file.fileName,
    id: file.fileId,
    path: file.filePath,
    type: 'file',
    extension: file.fileName.split('.').pop(),
  }))

  const refinedFolders = folders.map((folder) => ({
    name: folder.folderName,
    id: folder.folderId,
    path: folder.folderPath,
    type: 'folder',
  }))

  const mergeFiles = [...refinedFiles, ...refinedFolders]

  mergeFiles.sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') {
      return -1
    } else if (a.type === 'file' && b.type === 'folder') {
      return 1
    } else {
      return a.name.localeCompare(b.name)
    }
  })

  return mergeFiles
}

export function calculateDepth(pathname) {
  const segments = pathname.split('/').filter((segment) => segment !== '')
  return segments.length - 1
}

export function sanitizeFilePath(filePath) {
  return filePath.startsWith('root/') ? filePath.slice(5) : filePath
}
