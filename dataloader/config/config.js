var toolConfig = {
    "webUrl": "http://192.168.0.130:8085",
    "elasticUrl": "http://192.168.0.18:9200",
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