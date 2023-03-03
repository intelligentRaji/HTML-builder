const fs = require("fs/promises");
const path = require("path");

async function copyFolder(folderName) {
  const pathToFolder = path.join(__dirname, folderName);
  await fs.mkdir(path.join(__dirname, `${folderName}-copy`), {
    recursive: true,
  });
  const files = await fs.readdir(pathToFolder);
  for (let file of files) {
    await fs.copyFile(
      path.join(pathToFolder, file),
      path.join(__dirname, `${folderName}-copy`, file)
    );
  }
}

copyFolder("files");
