const { decode, fileParse } = require('rle-decoder');
const { readdir } = require('fs/promises');
const fs = require('fs');
const Template = require('./models/template.js');

async function addFileToDB(file, folderPath) {
  const data = await fileParse(`${folderPath}${file}`);
  //2339 files sent to db
  const response = await Template.create(data);
  console.log(response);
}

async function checkFileToBig(files) {
  const parsedFiles = await files.map((item) =>
    fileParse(`${folderPath}${item}`)
  );

  const toBig = [];
  for (let i = 0; i < parsedFiles.length; i++) {
    if (parsedFiles[i].size.x > 200 || parsedFiles[i].size.y > 200) {
      toBig.push(i);
    }
  }

  //moved 233 of the 2,572 files were to big to be used. moved to another directory.
  //2339 files remaining
  toBig.forEach((index) =>
    fs.rename(
      `${folderPath}${files[index]}`,
      `../../convert/moved${files[index]}`,
      function (err) {
        if (err) {
          console.error(err);
        }
      }
    )
  );
}
async function readDirFilePath(folderPath) {
  try {
    const files = await readdir(folderPath);

    for (const file of files) {
      // checkFileToBig(file)
      // addFileToDB(file, folderPath);
    }
  } catch (err) {
    console.error(err);
  }
}
module.exports = readDirFilePath;
