// Update following to configure tool
// 1. webUrl: provide url of the RDF API server to connect to for loading models and data
// 2. templateVariables: provide template variables and their values for each option. 
//      All template variable should be present in file content with pattern {{TEMPLATE_VARIABLE}}. Example: {{ENVNAME}}
//      Here is sample for "templateVariables"
//      "templateVariables": {
//          "rsconnectprofiles": {
//              "ENVNAME": "qa2-us-east-1",
//              "AWSREGIONNAME": "us-east-1",
//              "AWSCREDENTIALSTYPE": "AMAZON_EC2_INSTANCE_PROFILE"
//          },
//          "config": {
//              "TENANT_WEBSITE_URL": "www.jcpenney.com"
//          },
//          "entitymodels": {
//              "BLAH_KEY": "blah-value"
//          },
//          "governancemodel": {
//              "BLAH_KEY": "blah-value"
//          }
//      }
// 3. delay and delayBetweenModelObjects to add delay beween two RDF calls

var toolConfig = {
    "webUrl": "http://manage.qa3.riversand-dataplatform.com:8085",
    "templateVariables": {
        "rsconnectprofiles": {
            "ENVNAME": "qa1-us-east-1",
            "AWSREGIONNAME": "us-east-1",
            "AWSCREDENTIALSTYPE": "AMAZON_EC2_INSTANCE_PROFILE",
            "TENANT": "ns"
        }
    },
    "elasticUrl": "http://192.168.0.85:9200",
    "delay": 10,
    "delayBetweenModelObjects": 1000
}

//we have two options to select. 1. all 2. tenant-config
// 1. option = all - to load kind of models, data and configs
// 2. option = tenant-config - to load tenant-config only
var quiteLoadConfig = {
    "enabled": true,
    "folderName": "jcp-v6",
    "tenantId": "jcpenney",
    "option": "uiconfig"
}

module.exports = {
    toolConfig: toolConfig,
    quiteLoadConfig: quiteLoadConfig
}