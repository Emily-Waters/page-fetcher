// Implement a node app called fetcher.js.
// It should take two command line arguments:
// a URL
// a local file path
// It should download the resource at the URL to the local path on your machine. Upon completion,
// it should print out a message like Downloaded and saved 1235 bytes to ./index.html.
// > node fetcher.js http://www.example.edu/ ./index.html
// Downloaded and saved 3261 bytes to ./index.html

const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const args = process.argv.slice(2);


const fetcher = (args, callback) => {
  
  const filePath = args[1];
    
  request(`https://www.${args[0]}`, (error, response, body) => {
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    if (!error) {

      if (fs.existsSync(filePath)) {
        rl.question("File Exists. Would you like to overwrite? (Y) : ", (answer) => {
          rl.close();
          if (answer === 'Y' || answer === 'y') {
            fs.writeFile(filePath, body, (error) => {
              if (!error) {
                return callback(filePath, body, false);
              } else {
                console.log(error);
                process.exit();
              }
            });
          }
        });
      } else {
        fs.writeFile(filePath, body, (error) => {
          if (!error) {
            return callback(filePath, body, false);
          } else {
            console.log(error);
            process.exit();
          }
        });
      }
    } else {
      console.log(error); // Print the error if one occurred
      process.exit();
    }
  });
};

fetcher(args, (filePath, body, error) => {
  if (!error) {
    console.log(`Downloaded and saved ${body.length} bytes to: "${filePath}"`);
  } else {
    console.log(error);
  }
  process.exit();
});