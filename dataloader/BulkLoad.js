var fs = require('fs');
var serviceConfig = require('./config/serviceConfig.json');
var dataIndexConfig = require('./config/dataIndexConfig.json');
var dataService = require('./DataService');

var path = "";

function getListOfDir(path) {
    this.path = path;
    return fs.readdirSync(path);
}

function startLoadingData(tenant) {
    if (this.path) {
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
            loaded = await sendDataToService(dataIndex, serviceName, tenant, data);
            if(loaded) {
                console.log(fileName + " got loaded successfully.\n");
            } else {
                console.log(fileName + " has some issue while loading.\n");                
            }
        }
    }
}

async function sendDataToService(dataIndex, serviceName, tenant, data) {
    var serviceUrl;
    var dataIndexInfo;
    var serConfig = serviceConfig.services[serviceName + "/create"];
    if (serConfig) {
        serviceUrl = serConfig.url;
    } else {

    }

    if (dataIndexConfig) {
        dataIndexInfo = dataIndexConfig[dataIndex];
    } else {

    }

    if (serviceUrl && dataIndexInfo) {
        data.forEach(async function (dataObj) {
            var dataOperation = {};
            var requestObj = {
                'includeRequest': false,
                'dataIndex': dataIndex
            };

            requestObj[dataIndexInfo.name] = dataObj;
            dataOperation = await dataService.sendRequest(tenant, serviceUrl, requestObj);

            if (dataOperation) {
                if (dataOperation.entityOperationResponse) {
                    if (dataOperation.entityOperationResponse.status != "success") {
                        fs.appendFileSync("./errors.log", JSON.stringify(dataOperation));
                    } else {
                        fs.appendFileSync("./info.log", JSON.stringify(dataOperation));
                    }
                } else if (dataOperation.entityModelOperationResponse) {
                    if (dataOperation.entityModelOperationResponse.status != "success") {
                         fs.appendFileSync("./errors.log", JSON.stringify(dataOperation));
                    } else {
                        fs.appendFileSync("./info.log", JSON.stringify(dataOperation));                        
                    }
                } else {
                    fs.appendFileSync("./errors.log", JSON.stringify(dataOperation));
                }
            }
        }, this);
        return await true;
    } else {
        console.error("service URL or data index info is not available.");
        return await false;
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