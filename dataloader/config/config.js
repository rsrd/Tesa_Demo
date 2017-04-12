var toolConfig = {
    "webUrl": "http://192.168.0.85:8085",
    "elasticUrl": "http://192.168.0.85:9200",
    "delay": 100
}

//we have two options to select. 1. all 2. tenant-config
// 1. option = all - to load model, data and configs
// 2. option = tenant-config - to load tenant-config only
var quiteLoadConfig = {
    "enabled": false,
    "folderName": "jcp-v2",
    "tenantId": "jcp",
    "option": "all",
    "flush": "N"
}

module.exports = {
    toolConfig: toolConfig,
    quiteLoadConfig: quiteLoadConfig
}