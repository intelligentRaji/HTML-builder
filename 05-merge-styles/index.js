const fs = require("fs/promises");
const path = require("path");
const { createWriteStream, createReadStream } = require("fs");

async function createBundleCSS(folderName, targetName) {
  const folderPath = path.join(__dirname, folderName);
  const dirPath = path.join(__dirname, "project-dist");
  const targetPath = path.join(dirPath, targetName);

  fs.mkdir(folderPath, { recursive: true });

  const writableStream = createWriteStream(targetPath);

  const files = await fs.readdir(folderPath);
  for (let file of files) {
    const filePath = path.join(folderPath, file);
    if (path.extname(filePath) === ".css") {
      await new Promise((res, rej) => {
        const readableStream = createReadStream(filePath, "utf-8");
        readableStream.on("data", (chunk) => {
          writableStream.write(chunk, "utf-8");
        });
        readableStream.on("end", () => {
          res();
        });
      });
    }
  }
}

createBundleCSS("styles", "bundle.css");
