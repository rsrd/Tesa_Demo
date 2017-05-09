var toolConfig = {
    "webUrl": "http://qa-us-east-1.riversand-dataplatform.com:8085",
    "elasticUrl": "http://192.168.0.85:9200",
    "delay": 10,
    "delayBetweenModelObjects": 1000
}

//we have two options to select. 1. all 2. tenant-config
// 1. option = all - to load kind of models, data and configs
// 2. option = tenant-config - to load tenant-config only

var quiteLoadConfig = {
    "enabled": true,
    "folderName": "jcp-v3-contextmodel",
    "tenantId": "jcp",
    "option": "referencedata",
}

module.exports = {
    toolConfig: toolConfig,
    quiteLoadConfig: quiteLoadConfig
}