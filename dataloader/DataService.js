var dataServiceBase = require('./DataServiceBase');
var config = require('./config/config');

async function sendDataRequest(tenantId, serviceUrl, req) {
    var url = config.toolConfig.webUrl + '/' + tenantId + '/api' + serviceUrl;

    var options = _prepareOptions(url, "POST", req);
    var result = await dataServiceBase.sendRequest(options);

    return await result;
}

async function createIndicesRequest(tenantId, index, indexConfig) {
    var url = config.toolConfig.elasticUrl + '/' + tenantId + index;

    var options = _prepareOptions(url, "PUT", indexConfig);
    var result = await dataServiceBase.sendRequest(options);
    console.log(index + "create");
    console.log(JSON.stringify(result));
    return await result;
}

async function deleteIndicesRequest(tenantId, index) {
    var url = config.toolConfig.elasticUrl + '/' + tenantId + index;
    var options = _prepareOptions(url, "DELETE", "");
    var result = await dataServiceBase.sendRequest(options);
    console.log(index + "delete");
    console.log(JSON.stringify(result));    
    return result;
}


function _prepareOptions(url, method, req) {
    var options = {
        url: url,
        method: method,
        headers: {
            "Cache-Control": "no-cache",
            "version": 8.1,
            "content-type": "application/json",
            "x-rdp-userRoles": '["buyer"]'
        },
        body: req,
        json: true,
        simple: false,
        timeout: 5000
    };

    return options;
}


module.exports = {
    sendDataRequest: sendDataRequest,
    createIndicesRequest: createIndicesRequest,
    deleteIndicesRequest: deleteIndicesRequest
}