const request = require('request');
const fs = require('fs');
const readline = require('readline');
const args = process.argv.slice(2);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//HELPER TO WRITE TO A FILE. IF NO ERROR IS FOUND, WRITES TO FILE. IF ERROR, DISPLAY THE ERROR AND QUIT.
const writeToFile = (path, data, callback) => {
  const timeStart = Date.now();
  fs.writeFile(path, data, (error) => {
    if (!error) {
      return callback(path, data, error, Date.now() - timeStart);
    } else {
      console.log(error);
      process.exit();
    }
  });
};

//FETCHER - TAKES IN TWO ARGUMENTS FROM THE COMMAND LINE, SOURCE AND FILEPATH
const fetcher = (args, callback) => {
  
  const fileSource = args[0];
  const filePath = args[1];
  let timestart = Date.now();
  
  request(`https://www.${fileSource}`, (error, response, body) => {
    if (!error) {
      console.log(`Status: ${response.statusMessage}\nCode:   ${response.statusCode}\nResponse Received In: ${Date.now() - timestart}ms`);
      if (fs.existsSync(filePath)) {
        rl.question("File Exists. Would you like to overwrite? (Y) : ", (answer) => {
          rl.close();
          if (answer === 'Y' || answer === 'y') {
            writeToFile(filePath, body, callback);
          }
        });
      } else {
        writeToFile(filePath, body, callback);
      }
    } else {
      console.log(error);
      process.exit();
    }
  });
};

fetcher(args, (filePath, body, error,time) => {
  if (!error) {
    console.log(`Downloaded and saved ${body.length} bytes to: "${filePath}" in ${time}ms`);
  } else {
    console.log(error);
  }
  process.exit();
});