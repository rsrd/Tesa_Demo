var toolConfig = {
    "webUrl": "http://192.168.0.48:8085",
    "elasticUrl": "http://192.168.0.35:9200",
    "delay": 100
}

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