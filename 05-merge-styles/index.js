const fs = require("fs/promises");
const path = require("path");
const { createWriteStream, createReadStream } = require("fs");

async function writeFile(arrayOfFiles, folder, writeStream) {
  if (arrayOfFiles.length !== 0) {
    const filePath = path.join(folder, arrayOfFiles[0]);
    if (path.extname(filePath) === ".css") {
      const readableStream = createReadStream(filePath, "utf-8");
      readableStream.on("data", (chunk) => {
        writeStream.write(chunk, "utf-8");
      });
      readableStream.on("end", () => {
        writeFile(arrayOfFiles.slice(1), folder, writeStream);
      });
    } else {
      writeFile(arrayOfFiles.slice(1), folder, writeStream);
    }
  }
}

async function createBundleCSS(folderName, targetName) {
  const folderPath = path.join(__dirname, folderName);
  const dirPath = path.join(__dirname, "project-dist");
  const targetPath = path.join(dirPath, targetName);

  fs.mkdir(folderPath, { recursive: true });

  const writableStream = createWriteStream(targetPath);

  const files = await fs.readdir(folderPath);
  writeFile(files, folderPath, writableStream);
}

createBundleCSS("styles", "bundle.css");
