var fs = require('fs');
var sleep = require('system-sleep');

var serviceConfig = require('./config/serviceConfig.json');
var dataIndexConfig = require('./config/dataIndexConfig.json');
var indicesConfig = require('./config/indicesConfig.json');
var config = require('./config/config');

var dataService = require('./DataService');

var path = "";

var logPath = './logs';

var counters = {};

function getListOfDir(path) {
    this.path = path;
    return fs.readdirSync(path);
}

function startLoadingData(folder, option, tenant, flush) {

    var selectedFolders = getSelectedFolderNames(option);
    if (this.path && selectedFolders && selectedFolders.length) {

        var path = this.path + "" + folder + "/";
        var timestamp = Date.now();

        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath);
        }

        var tenantLogDir = logPath + '/' + tenant;
        if (!fs.existsSync(tenantLogDir)) {
            fs.mkdirSync(tenantLogDir);
        }

        deleteAndCreateIndices(tenant, option, flush).then(function (results) {
            
            console.log("\nStarted loading data from : " + folder + " for tenant : " + tenant);
            
            if (checkIndicesStatus(results)) {
                selectedFolders.forEach(function (selectedFolder) {
                    if (selectedFolder) {
                        var tenantDataLogDir = tenantLogDir + '/' + timestamp ;

                        if (!fs.existsSync(tenantDataLogDir)) {
                            fs.mkdirSync(tenantDataLogDir);
                        }

                        logPath = tenantDataLogDir + '/' + selectedFolder;
                        fs.mkdirSync(logPath);
                        var dir = path + selectedFolder + "/";       
                        var files = getListOfDir(dir);

                        console.log("\n----------------------------- Logs for " + selectedFolder + " -----------------------------------\n");
                        if (files && files.length > 0) {
                            files.forEach(function (file) {
                                if (file != ".DS_Store") {
                                    console.log("reading file: " + file);
                                    var fileData = fs.readFileSync(dir + file);
                                    var loaded = loadData(tenant, file, JSON.parse(fileData.toString()));
                                }
                            }, this);
                        } else { }

                        if (counters) {
                            console.log('Total RDF requests generated: ', JSON.stringify(counters, null, 3));
                        }
                    }
                }, this);
            } else {
                console.log("Error in deleting and creating indices. logs:" + JSON.stringify(indicesResults));
            }
        }, this);
    }
}

async function loadData(tenant, fileName, fileData) {
    var loaded = false;

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

            loaded = await sendDataToService(fileName, dataIndex, serviceName, tenant, data);
            if (loaded) {
                console.log(fileName + " loaded successfully.\n");
            } else {
                console.log(fileName + " has issues. Please check logs.\n");
            }
        }
    }

    return await loaded;
}

async function sendDataToService(fileName, dataIndex, serviceName, tenant, data) {
    var serviceUrl;
    var dataIndexInfo;

    var logFileName = logPath + '/' + fileName + '.log';

    //console.log(logFileName);

    if (counters[dataIndex] === undefined) {
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

    var delay = config.toolConfig.delay;
    //console.log(delay);

    if (serviceUrl && dataIndexInfo) {
        data.forEach(async function (dataObj) {
            var res = {};
            var requestObj = {
                'includeRequest': false,
                'dataIndex': dataIndex
            };

            requestObj[dataIndexInfo.name] = dataObj;

            sleep(delay); // sleep for 100 ms

            if (counters[dataIndex] !== undefined) {
                counters[dataIndex] = counters[dataIndex] + 1;
            }

            //console.log('req ', JSON.stringify(requestObj, null, 2));

            res = await dataService.sendDataRequest(tenant, serviceUrl, requestObj);

            if (res) {
                var response = res[dataIndexInfo.responseObjectName];

                if (response) {
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

async function deleteAndCreateIndices(tenantId, selectedFolder, flush) {

    var results = [];
    var promise;
    
    if(flush == "y" || flush == "Y") {
        console.log("deleting indices...");

        promise = deleteIndices(tenantId, selectedFolder).then(function (result) {
            results = result;
            
            if (checkIndicesStatus(result)) {
                sleep(3000);
                results = createIndices(tenantId, selectedFolder);
            } else {
                console.log("error while deleting indices" + JSON.stringify(results));
            }
        });

        await Promise.resolve(promise);
    }

    return results;
}

async function deleteIndices(tenantId, selectedFolder) {

    var results = [];
    var promises = [];
    if (tenantId && selectedFolder) {
        var indices = getIndices(selectedFolder);
        if (indices && indices.length) {
            indices.forEach(function (index) {
                var req = dataService.deleteIndicesRequest(tenantId, index).then(function (result) {
                    console.log(result);
                    results.push(result);
                });
                promises.push(req);
            }, this);
        }
    }

    await Promise.all(promises);
    return results;
}

async function createIndices(tenantId, selectedFolder) {

    var results = [];
    var promises = [];
    if (tenantId && selectedFolder && indicesConfig) {
        var indices = getIndices(selectedFolder);
        if (indices && indices.length) {
            indices.forEach(function (index) {
                var indexConfig = indicesConfig[index];
                var req = dataService.createIndicesRequest(tenantId, index, indexConfig).then(function (result) {
                    console.log(result);
                    results.push(result);
                });
                promises.push(req);
            }, this);
        }
    }

    await Promise.all(promises);
    return results;
}

function getServiceName(dataIndex) {
    if (!dataIndex) {
        return "NA";
    };

    if (dataIndex == "entityData") {
        return "entityservice";
    } else if (dataIndex == "entityGovernData") {
        return "entitygovernservice";
    } else if (dataIndex == "entityModel") {
        return "entitymodelservice";
    } else if (dataIndex == "config") {
        return "configurationservice";
    } else {
        return "entityservice";
    }
}

function getSelectedFolderNames(option) {

    var selectedFolders = [];
    switch (option.toLowerCase()) {
        case "all":
            //selectedFolders.push("00-tenant-config", "01-model", "02-data", "03-config");
            selectedFolders.push("01-model", "02-data", "03-config");
            break;
        case "tenant-config":
            selectedFolders.push("00-tenant-config");
            break;
        case "model":
            selectedFolders.push("01-model");
            break;
        case "data":
            selectedFolders.push("02-data");
            break;
        case "config":
            selectedFolders.push("03-config");
            break;
    }

    return selectedFolders;
}

function getIndices(selectedFolder) {

    var indices = [];
    switch (selectedFolder.toLowerCase()) {
        case "all":
            indices.push("entitywriteindex", "entitymanagemodelwriteindex", "configurationwriteindex");
            break;
        case "model":
            indices.push("entitymanagemodelwriteindex");
            break;
        case "data":
            indices.push("entitywriteindex");
            break;
        case "config":
            indices.push("configurationwriteindex");
            break;
    }

    return indices;
}

function checkIndicesStatus(results, flush) {

    if(!flush) {
        return true;
    }

    var status = false;

    if (results && results.length) {
        results.forEach(function (result) {
            if (result && result.acknowledged) {
                if (!result.acknowledged) {
                    return false;
                }
            } else {
                return false;
            }
        }, this);

        return true;
    }

    return false;
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


module.exports = {
    getListOfDir: getListOfDir,
    startLoadingData: startLoadingData
}