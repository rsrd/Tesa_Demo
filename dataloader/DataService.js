var request = require('request-promise-native');
var config = require('./config/config');


async function sendRequest(tenantId, serviceUrl, req) {
    var url = config.toolConfig.url + '/' + tenantId + '/api' + serviceUrl;

    var options = {
        url: url,
        method: "POST",
        headers: {
            "Cache-Control": "no-cache",
            "version": 8.1
        },
        body: req,
        json: true,
        simple: false,
        timeout: 5000
    };

    var reqPromise = request(options)
        .catch(function (errors) {
            var err = {
                'status': 'error',
                'msg': 'RDF request failed due to technical reasons',
                'reason': errors
            };

            //console.error('EXCEPTION:', JSON.stringify(err, null, 2));
            return err;
        })
        .catch(function (err) {
            //console.error(err);
        });

    return await reqPromise;
}

module.exports = {
    sendRequest: sendRequest
}