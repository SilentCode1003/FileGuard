const sanitizeFilePath = (filePath) => {
    return filePath.startsWith('root/') ? filePath.slice(5) : filePath;
  };
  
  export default sanitizeFilePath;
  