import fs from "fs";

export const createFolder = (dir:any) => {
    //console.log(`Create folder: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  
    if (fs.existsSync(dir)) {
      //console.log(`Path exist: ${dir}`);
      return "exist";
    } else {
      //console.log(`Create path: ${dir}`);
      fs.mkdirSync(dir);
      return "create";
    }
  };

  export const decodeBase64ToFile = (base64String: string, filePath: string) => {
    // Decode the Base64 string
    const pdfBuffer = Buffer.from(base64String, "base64");
  
    // Write the binary data to a file
    fs.writeFile(filePath, pdfBuffer, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File saved successfully:", filePath);
      }
    });
  }