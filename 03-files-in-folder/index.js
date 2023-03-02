const fs = require("fs/promises");
const path = require("path");

async function readFolder(pathToFolder, name) {
  try {
    return fs.readdir(pathToFolder);
  } catch (err) {
    throw new Error(`cannot read ${name} files`);
  }
}

async function getStats(pathToFile, sum) {
  try {
    const fileStats = await fs.stat(path.join(pathToFile, sum));
    if (fileStats.isDirectory()) return checkFolder(pathToFile, sum);
    console.log(
      `${path.basename(sum, path.extname(sum))} - ${path
        .extname(sum)
        .slice(1)} - ${fileStats.size / 1000}kb`
    );
  } catch (err) {
    throw new Error(`connot check ${sum} stats`);
  }
}

async function checkFolder(pathToFolder, name) {
  const folderPath = path.join(pathToFolder, name);
  const files = await readFolder(folderPath, name);
  const res = {};
  for (let file of files) {
    const fileStats = await getStats(folderPath, file);
    res[file] = fileStats;
  }
}

checkFolder(__dirname, "secret-folder");
