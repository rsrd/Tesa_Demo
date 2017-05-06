var toolConfig = {
    "webUrl": "http://perf-us-west-2.riversand-dataplatform.com:8085",
    "elasticUrl": "http://192.168.0.85:9200",
    "delay": 50,
    "delayBetweenModelObjects": 2000
}

//we have two options to select. 1. all 2. tenant-config
// 1. option = all - to load kind of models, data and configs
// 2. option = tenant-config - to load tenant-config only

var quiteLoadConfig = {
    "enabled": true,
    "folderName": "jcp-v3",
    "tenantId": "jcp",
    "option": "rsconnectProfiles",
}

// quiteLoadConfig = {
//     "enabled": true,
//     "folderName": "jcp-v2",
//     "tenantId": "jcp",
//     "option": "config",
// }

module.exports = {
    toolConfig: toolConfig,
    quiteLoadConfig: quiteLoadConfig
}