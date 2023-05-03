const fs = require("fs/promises");
const path = require("path");

async function copyFolder(folderName) {
  const copyFolderPath = path.join(__dirname, `${folderName}-copy`);
  const pathToFolder = path.join(__dirname, folderName);
  await fs.rm(copyFolderPath, { recursive: true, force: true });
  await fs.mkdir(path.join(copyFolderPath), {
    recursive: true,
  });
  const files = await fs.readdir(pathToFolder);
  for (let file of files) {
    await fs.copyFile(
      path.join(pathToFolder, file),
      path.join(copyFolderPath, file)
    );
  }
}

copyFolder("files");
