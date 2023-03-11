const fs = require("fs/promises");
const path = require("path");
const { createWriteStream, createReadStream } = require("fs");

async function isFolder(filePath) {
  const stats = await fs.stat(filePath);
  return stats.isDirectory();
}

async function copyFolder(folderPath, targetPath) {
  await fs.mkdir(targetPath, {
    recursive: true,
  });
  const files = await fs.readdir(folderPath);
  for (let file of files) {
    if (await isFolder(path.join(folderPath, file))) {
      await copyFolder(
        path.join(folderPath, file),
        path.join(targetPath, file)
      );
    } else {
      await fs.copyFile(
        path.join(folderPath, file),
        path.join(targetPath, file)
      );
    }
  }
}

async function createBundleCSS(folderPath, targetPath) {
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

async function getComponentContent(componentPath) {
  let result = "";
  await new Promise((res) => {
    const readableStream = createReadStream(componentPath, "utf-8");
    readableStream.on("data", (chunk) => {
      result += chunk;
    });
    readableStream.on("end", () => {
      res();
    });
  });
  return result;
}

async function copyHTML(filePath, targetPath, componentsPath) {
  const writableStream = createWriteStream(targetPath);
  const readableStream = createReadStream(filePath, "utf-8");
  const components = await fs.readdir(componentsPath);
  readableStream.on("data", async (chunk) => {
    for (let component of components) {
      if (
        chunk.includes(
          `{{${path.parse(path.join(componentsPath, component)).name}}}`
        )
      ) {
        const componentContent = await getComponentContent(
          path.join(componentsPath, component)
        );
        chunk = chunk.replace(
          `{{${path.parse(path.join(componentsPath, component)).name}}}`,
          componentContent
        );
      }
    }
    writableStream.write(chunk, "utf-8");
  });
}

async function createDistFolder(folderName) {
  const distPath = path.join(__dirname, folderName);
  await fs.mkdir(distPath, { recursive: true });
  await copyFolder(
    path.join(__dirname, "assets"),
    path.join(distPath, "assets")
  );
  await createBundleCSS(
    path.join(__dirname, "styles"),
    path.join(distPath, "style.css")
  );
  await copyHTML(
    path.join(__dirname, "template.html"),
    path.join(distPath, "index.html"),
    path.join(__dirname, "components")
  );
}

createDistFolder("project-dist");
