var toolConfig = {
    "webUrl": "http://qa-int.riversand-dataplatform.com:8085",
    "elasticUrl": "http://192.168.0.18:9200",
    "delay": 100,
    "delayBetweenModelObjects": 10000
}

//we have two options to select. 1. all 2. tenant-config
// 1. option = all - to load kind of models, data and configs
// 2. option = tenant-config - to load tenant-config only

var quiteLoadConfig = {
    "enabled": true,
    "folderName": "jcp-v3",
    "tenantId": "pmqa",
    "option": "referencedata",
    "flush": "Y"
}

// quiteLoadConfig = {
//     "enabled": true,
//     "folderName": "jcp-v2",
//     "tenantId": "jcp",
//     "option": "all",
//     "flush": "N"
// }

module.exports = {
    toolConfig: toolConfig,
    quiteLoadConfig: quiteLoadConfig
}