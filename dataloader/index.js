require("babel-register");
require("babel-polyfill");

var bulkLoad = require('./BulkLoad');
const readline = require('readline');
var config = require('./config/config');

var pwd = '../';

var list = bulkLoad.getListOfDir(pwd);

var ignoreList = ['dataloader', '.git', '.gitignore', 'debug.log', 'README.md', 'node_modules', '.vscode'];

console.log("Hi, there! let us start the load...");

console.log("\nYou have below data folders available in the configured path---------------\n");
list.forEach(function (item) {
    var isInIgnoreList = ignoreList.find(i => i == item);

    if (!isInIgnoreList) {
        console.log(item);
    }
}, this);
console.log("\n----------------------------------------------------------------------------\n");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//bulkLoad.startLoadingData("bsdf");

//bulkLoad.startLoadingData("jcp", "model", "t1");

rl.question('1. Can you tell me folder name:', (folder) => {
    console.log("\n");
    rl.question("2. Good, next question, whats' the tenant Id:", (tenantId) => {
        console.log("\nYou have below options to choose from---------------------------------------\n");
        console.log("all");
        console.log("model");
        console.log("data");
        console.log("config");        
        console.log("\n----------------------------------------------------------------------------\n");
        rl.question('3. What option you like:', (option) => {
            rl.question('4. Ok, last question, do you want to flush the data before starting load? (Y/ N):', (flush) => {
                bulkLoad.startLoadingData(folder, option, tenantId, flush);
                rl.close();
            });
        });
    });
});

