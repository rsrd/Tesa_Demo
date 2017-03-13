require("babel-register");
require("babel-polyfill");

var bulkLoad = require('./BulkLoad');
const readline = require('readline');
var config = require('./config/config');

var list = bulkLoad.getListOfDir(config.toolConfig.path);

console.log("\n================Tenants list in given directory====================\n");
list.forEach(function(item) {
    console.log(item);
}, this);
console.log("\n====================================================================\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//bulkLoad.startLoadingData("bsdf");

rl.question('Which folder you wants to load? : <folder name>', (answer) => {
    bulkLoad.startLoadingData(answer);
    rl.close();
});