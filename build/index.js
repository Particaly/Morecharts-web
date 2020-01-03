var fs = require("fs");
var data = fs.readFileSync('.env', 'utf-8');

function getParam(name) {
    var reg = new RegExp( name + " = ([^\\n\\r]*)");
    var r = data.match(reg);
    if (r != null) return unescape(r[1]);
    return null;
}

function setParam(name, value) {
    var reg = new RegExp( name + " = ([^\\n\\r]*)");
    data = data.replace(reg, name + ' = ' + value);
}

var runningServe;
var VUE_APP_SERVION = getParam('VUE_APP_SERVION');
var VUE_APP_ENVIROMENT = getParam('VUE_APP_ENVIROMENT');

try {
    let runningType = JSON.parse(process.env.npm_config_argv).original;
    VUE_APP_ENVIROMENT = runningType[1]
    runningType.includes('serve')?runningServe=true:runningServe=false
} catch(ex) {
    argv = process.argv;

    argv.includes('serve')?runningServe=true:runningServe=false
}

if(!runningServe){
    VUE_APP_SERVION = (VUE_APP_SERVION*1 + 0.01).toFixed(2);
}else{
    VUE_APP_SERVION = (VUE_APP_SERVION*1).toFixed(2);
}

setParam('VUE_APP_ENVIROMENT', VUE_APP_ENVIROMENT);
setParam('VUE_APP_SERVION', VUE_APP_SERVION);

fs.writeFileSync('.env', data)