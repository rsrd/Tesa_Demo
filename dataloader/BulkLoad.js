var fs = require('fs');
var sleep = require('system-sleep');

var serviceConfig = require('./config/serviceConfig.json');
var dataIndexConfig = require('./config/dataIndexConfig.json');
var config = require('./config/config');

var dataService = require('./DataService');

var path = "";

var logPath = './logs';

var counters = {};

function getListOfDir(path) {
    this.path = path;
    return fs.readdirSync(path);
}

function startLoadingData(tenant) {
    if (this.path) {
        var timestamp = Date.now();

        var logDir = logPath + '/' + tenant + '/' + timestamp;
        fs.mkdirSync(logDir);
    
        logPath = logDir;

        var dir = this.path + tenant + "/";
        console.log("Started loading data from : " + tenant);
        var files = getListOfDir(dir);
        console.log("\n-----------------------------Logs-----------------------------------\n");
        if (files && files.length > 0) {
            files.forEach(function (file) {
                console.log("reading file: " + file);
                var fileData = fs.readFileSync(dir + file);
                loadData(tenant, file, JSON.parse(fileData.toString()));
            }, this);
        } else {}

        if(counters) {
            console.log('Total RDF requests generated: ', JSON.stringify(counters, null, 3));
        }
    }
}

async function loadData(tenant, fileName, fileData) {
    if (fileData) {
        console.log("loading file: " + fileName);
        var serviceName;
        var data;
        var dataIndex;
        if (fileData.metaInfo) {
            if (fileData.metaInfo.dataIndex) {
                dataIndex = fileData.metaInfo.dataIndex;
                serviceName = getServiceName(dataIndex);
            } else {
                console.error(fileName + ": file doesn't contains data index in meta info.");
            }

            if (fileData.metaInfo.collectionName) {
                data = fileData[fileData.metaInfo.collectionName];
            } else {
                console.error(fileName + ": file doesn't contains data index in meta info.");
            }
        } else {
            console.error(fileName + ": file doesn't contains meta info.");
        }

        if (serviceName && data) {
            var loaded = false;
            loaded = await sendDataToService(fileName, dataIndex, serviceName, tenant, data);
            if(loaded) {
                console.log(fileName + " loaded successfully.\n");
            } else {
                console.log(fileName + " has issues. Please check logs.\n");                
            }
        }
    }
}

async function sendDataToService(fileName, dataIndex, serviceName, tenant, data) {
    var serviceUrl;
    var dataIndexInfo;
    
    var logFileName = logPath + '/' + fileName + '.log';

    console.log(logFileName);

    if(counters[dataIndex] === undefined) {
        //console.log('counters are undefined for data index', dataIndex);
        counters[dataIndex] = 0;
    }

    //truncateFile(logFileName);

    //console.log(logFileName);
    var serConfig = serviceConfig.services[serviceName + "/create"];

    if (serConfig) {
        serviceUrl = serConfig.url;
    } else {

    }

    if (dataIndexConfig) {
        dataIndexInfo = dataIndexConfig[dataIndex];
    } 
    else {
    }

    var delay = config.delay;

    if (serviceUrl && dataIndexInfo) {
        data.forEach(async function (dataObj) {
            var res = {};
            var requestObj = {
                'includeRequest': false,
                'dataIndex': dataIndex
            };

            requestObj[dataIndexInfo.name] = dataObj;
        
            sleep(delay); // sleep for 100 ms

            if(counters[dataIndex] !== undefined) {
                counters[dataIndex] = counters[dataIndex] + 1;
            }

            res = await dataService.sendRequest(tenant, serviceUrl, requestObj);

            if(res) {
                var response = res[dataIndexInfo.responseObjectName];

                if(response) {
                    writeLog(logFileName, response.status, res);
                }
                else {
                    writeLog(logFileName, 'error', res);
                }
            }

        }, this);
        return await true;
    } else {
        console.error("service URL or data index info is not available.");
        return await false;
    }
}

function writeLog(logFile, status, res) {
    var timestamp = Date().toLocaleString();
    var message = timestamp + ":" + status.toUpperCase() + ":" + JSON.stringify(res) + "\r\n";
    //console.log(message);
    fs.appendFileSync(logFile, message);
}

function truncateFile(fileName) {
    if (fs.existsSync(fileName)) {
        fs.truncateSync(fileName, 0, function () { console.log('done') });
    }
}

function getServiceName(dataIndex) {
    if (!dataIndex) {
        return "NA";
    };

    if (dataIndex == "entityData") {
        return "entitymanageservice";
    } else if (dataIndex == "entityGovernData") {
        return "entitygovernservice";
    } else if (dataIndex == "entityModel") {
        return "entitymodelservice";
    } else {
        return "entitymanageservice";
    }
}



module.exports = {
    getListOfDir: getListOfDir,
    startLoadingData: startLoadingData
}