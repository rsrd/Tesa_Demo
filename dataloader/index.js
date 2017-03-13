require("babel-register");
require("babel-polyfill");

var bulkLoad = require('./BulkLoad');
const readline = require('readline');
var config = require('./config/config');

var pwd = '../';

var list = bulkLoad.getListOfDir(pwd);

var ignoreList = ['dataloader', '.git', '.gitignore', 'debug.log', 'README.md', 'node_modules', '.vscode'];

console.log("\n================Availalble tenants in configured data path====================\n");
list.forEach(function(item) {
    var isInIgnoreList = ignoreList.find(i => i == item);

    if(!isInIgnoreList) {
        console.log(item);
    }
}, this);
console.log("\n==============================================================================\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//bulkLoad.startLoadingData("bsdf");

rl.question('Provide tenant name to load:', (folder) => {
    bulkLoad.startLoadingData(folder);
    rl.close();
});