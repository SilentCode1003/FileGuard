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
