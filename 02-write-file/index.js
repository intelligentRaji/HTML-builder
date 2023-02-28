const fs = require("fs");
const path = require("path");
const readline = require("readline");

const writeableStream = fs.createWriteStream(path.join(__dirname, "text.txt"));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.on("close", () => {
  console.log("Bye, have a nice day!");
});

function writeAnswer(text) {
  writeableStream.write(`${text}\n`);
  console.log(`File text.txt has been updated. String ${text} has been added`);
  message();
}

function closeStream() {
  writeableStream.end();
  rl.close();
}

function message() {
  rl.question("Write something: ", (answer) => {
    if (answer === "exit") {
      closeStream();
    } else {
      writeAnswer(answer);
    }
  });
}

function greetingMessage() {
  rl.question("Hello. What do u want to write? ", (answer) => {
    if (answer === "exit") {
      closeStream();
    } else {
      console.log("File text.txt has been created");
      writeAnswer(answer);
    }
  });
}

greetingMessage();
