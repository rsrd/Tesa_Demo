require("babel-register");
require("babel-polyfill");

var bulkLoad = require('./BulkLoad');
const readline = require('readline');
var config = require('./config/config');

var pwd = '../';

var list = bulkLoad.getListOfDir(pwd);

var ignoreList = ['dataloader', '.git', '.gitignore', 'debug.log', 'README.md', 'node_modules', '.vscode'];

console.log("\n================ Available data folders in configured data path ====================\n");
list.forEach(function (item) {
    var isInIgnoreList = ignoreList.find(i => i == item);

    if (!isInIgnoreList) {
        console.log(item);
    }
}, this);
console.log("\n=====================================================================================\n");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//bulkLoad.startLoadingData("bsdf");

//bulkLoad.startLoadingData("jcp", "model", "t1");

rl.question('Provide source data folder name:', (folder) => {
    rl.question('Provide tenant id:', (tenantId) => {
        console.log("\n================ options ====================\n");
        console.log("all");
        console.log("model");
        console.log("data");
        console.log("config");        
        console.log("\n=============================================\n");
        rl.question('Provide option to load:', (option) => {
            bulkLoad.startLoadingData(folder, option, tenantId);
            rl.close();
        });
    });
});

