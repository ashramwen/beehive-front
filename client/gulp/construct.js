'use strict'

var gulp = require('gulp');
var paths = gulp.paths;
var fs = require('fs');

// CONSTANTS
const CONSTRUCT_FILE = gulp.paths.appStructFile,
      APP_PATH = gulp.paths.appPath,
      TEMPLATE_PATH = gulp.paths.templatePath,
      CSS_TEMPLATE_PATH = TEMPLATE_PATH + 'style.template.css',
      CONTROLLER_TEMPLATE_PATH = TEMPLATE_PATH + 'controller.template.js',
      ROUTE_TEMPLATE_PATH = TEMPLATE_PATH + 'route.template.js',
      HTML_TEMPLATE_PATH = TEMPLATE_PATH + 'view.template.html',
      SERVICE_TEMPLATE_PATH = TEMPLATE_PATH + 'service.template.js',
      STATE_TEMPLATE_PATH = TEMPLATE_PATH + 'state.template.js';

var componentsPath = '';

// cache templates
var templateCache = {
    css: fs.readFileSync(CSS_TEMPLATE_PATH).toString(),
    controller: fs.readFileSync(CONTROLLER_TEMPLATE_PATH).toString(),
    html: fs.readFileSync(HTML_TEMPLATE_PATH).toString(),
    service: fs.readFileSync(SERVICE_TEMPLATE_PATH).toString(),
    route: fs.readFileSync(ROUTE_TEMPLATE_PATH).toString(),
    state: fs.readFileSync(STATE_TEMPLATE_PATH).toString()
};

// template field name place holder
const nameHolders = {
    APP_NAME: 'MyApp',
    SERVICE_NAME: 'MyService',
    SERVICE_FIELD_NAME: 'myService',
    CONTROLER_NAME: 'MyController',
    ROUTE_NAME: 'MyRoute',
    SUB_STATE_NAME: 'MySubState',
    TEMPLATE_NAME: 'MyTemplate',
    STATE_NAME: 'MyState',
    STATE_LIST: 'MyStateList',
    URL_NAME: 'MyUrl',
};

// global variables
var appName = "";

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.lowerFirstLetter = function() {
    return this.charAt(0).toLowerCase() + this.slice(1);
}

// render
function render(){
    var rstream = fs.createReadStream(CONSTRUCT_FILE);

    var content = "";
    rstream
        .on('data', function (chunk) {
            content += chunk;
        })
        .on('end', function () {  // done
            var result = JSON.parse(content);
            var structure = result.structure;

            appName = result.appName;
            gulp.appName = result.appName.capitalizeFirstLetter();
            buildProject(structure);
        });
}



// end
// ************************************************

function buildProject(structure){    

    let appPath = APP_PATH + '/' + structure.name;

    // create app base path
    console.log('making directory:' + appPath +' ......');
    if(!fs.existsSync(appPath)){
        fs.mkdirSync(appPath);
    }

    // create components folder
    componentsPath =  APP_PATH + '/' + structure.name + '/components';

    console.log('making Components Folder:' + componentsPath +' ......');
    if(!fs.existsSync(componentsPath)){
        fs.mkdirSync(componentsPath);
    }

    // create shared folder
    let sharedFolder = APP_PATH + '/' +  structure.name + '/shared';

    console.log('making Shared Folder:' + sharedFolder +' ......');
    if(!fs.existsSync(sharedFolder)){
        fs.mkdirSync(sharedFolder);
    }

    makeFiles(APP_PATH, structure, []);
    for(let module in structure.subModules){
        retrivalStructure(structure.subModules[module], componentsPath, [structure.name]);
    }
}

function retrivalStructure(node, path, nodeList){

    makeFiles(path, node, nodeList);

    if(!node.subModules || node.subModules.length==0)return false;

    let directoryPath = path + '/' + node.name;
    for(let module in node.subModules){
        let preNodeList = clone(nodeList);
        preNodeList.push(node.name);

        retrivalStructure(node.subModules[module], directoryPath, preNodeList);
    }
}

function makeFiles(path, node, stateList){
    let name = node.name;
    let children = [];
    if(node.subModules){
        for(let child in node.subModules){
            children.push(node.subModules[child].name);
        }
    }
    let directoryPath =  path + "/" + name;

    console.log('making directory:' + directoryPath +' ......');
    if(!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath);
    }

    let fd = null;
    let controllerName = directoryPath + '/' + name + '.controller.js',
        htmlName = directoryPath + '/' + name + '.html',
        cssName = directoryPath + '/' + name + '.scss',
        serviceName = directoryPath + '/' + name + '.service.js';

    // create controller
    console.log('making file:' + controllerName);
    if(!fs.existsSync(controllerName)){
        fd = fs.openSync(controllerName, 'w');
        let content = makeController(name);
        fs.writeSync(fd, content, 0, content.length);
        fs.closeSync(fd);
    }
    
    // create Html
    console.log('making file:' + htmlName);
    if(!fs.existsSync(htmlName)){
        fd = fs.openSync(htmlName, 'w');
        let content = makeHtml(name, stateList);
        fs.writeSync(fd, content, 0, content.length);
        fs.closeSync(fd);
    }

    // create css
    console.log('making file:' + cssName);
    if(!fs.existsSync(cssName)){
        fd = fs.openSync(cssName, 'w');
        let content = makeCss(name, stateList);
        fs.writeSync(fd, content, 0, content.length);
        fs.closeSync(fd);
    }
    
    // create service
    /*
    console.log('making file:' + serviceName);
    if(!fs.existsSync(serviceName)){
        fd = fs.openSync(serviceName, 'w');
        let content = makeService(name);
        fs.writeSync(fd, content, 0, content.length);
        fs.closeSync(fd);
    }
    */
    
    // create route
    if(children && (children.length > 0)){
        let routeName = directoryPath + '/' + name + '.route.js';
        console.log('making file:' + routeName);
        if(!fs.existsSync(routeName)){
            fd = fs.openSync(routeName, 'w');
            // create route
            let content = makeRoute(node, stateList);
            fs.writeSync(fd, content, 0, content.length);
            fs.closeSync(fd);
        }
    }
}

function makeHtml(name, stateList){
    let template = templateCache.html;
    let tmpList = clone(stateList);
    tmpList.push(name);

    template = replaceTemplate('moduleName', tmpList.join('-').toLowerCase(), template).produce();
    return template
}

function makeCss(name, stateList){
    let template = templateCache.css;
    let tmpList = clone(stateList);
    tmpList.push(name);
    template = replaceTemplate('moduleName', tmpList.join('-').toLowerCase(), template).produce();
    return template
}

function makeController(name){
    let template = templateCache.controller,

        appPlaceHolder = nameHolders.APP_NAME,
        controllerHolder = nameHolders.CONTROLER_NAME,

        controllerName = name.capitalizeFirstLetter() + 'Controller';

    // produce controller file
    template = replaceTemplate(appPlaceHolder, appName, template)
                .replace(controllerHolder, controllerName)
                .produce();

    return template
}

function makeService(name){
    let template = templateCache.service,

        appPlaceHolder = nameHolders.APP_NAME,
        serviceHolder = nameHolders.SERVICE_NAME,
        serviceFieldHolder = nameHolders.SERVICE_FIELD_NAME,

        serviceName = name.capitalizeFirstLetter() + 'Service',
        serviceFiledName = name.lowerFirstLetter() + 'Service';

    // produce service file
    template = replaceTemplate(appPlaceHolder, appName, template)
                .replace(serviceHolder, serviceName)
                .replace(serviceFieldHolder, serviceFiledName)
                .produce();

    return template
}

function makeRoute(node, states){
    let name = node.name,
        abstract = node.abstract,
        stateList = clone(states);
    stateList.push(name);

    let stateTemplate = templateCache.state,
        subStateHolder = nameHolders.SUB_STATE_NAME,
        stateHolder = nameHolders.STATE_NAME,
        urlHolder = nameHolders.URL_NAME,
        controllerHolder = nameHolders.CONTROLER_NAME,
        templateHolder = nameHolders.TEMPLATE_NAME;

    let templateProducer = null
    for(let index in node.subModules){
        let name = node.subModules[index].name,
            isAbstract = node.subModules[index].abstract || false;

        let myStateArray = clone(stateList);
        myStateArray.push(name);

        let myState = myStateArray.join('.'),
            myUrl = '/' + name,
            myTemplate = myStateArray.join('/') + '/' + name + '.html',
            myController = name.capitalizeFirstLetter() + 'Controller';
        if(myState.length>1){
            myTemplate = myStateArray[0] + '/components/' + myStateArray.slice(1).join('/') + '/' + name + '.html';
        }

        if(templateProducer){
            templateProducer = templateProducer.replace(stateHolder,myState);
                                
        }else{
            templateProducer = replaceTemplate(stateHolder,myState, stateTemplate);
                                
        }
        templateProducer = templateProducer.replace(urlHolder, myUrl)
                                .replace(controllerHolder, myController)
                                .replace(templateHolder, '\r\n        templateUrl: \'' + myTemplate + '\',');

        if(isAbstract){
            templateProducer = templateProducer.replace('abstract', '\r\n        abstract: true,');
        }else{
            templateProducer = templateProducer.replace('abstract', '');
        }

        if(index == node.subModules.length - 1 ){
            templateProducer = templateProducer.replace(subStateHolder, ';'); 
        }else{
            templateProducer = templateProducer.replace(subStateHolder, stateTemplate);
        }
    }
    let stateOutput = templateProducer.produce();

    let routeTemplate = templateCache.route,
        appPlaceHolder = nameHolders.APP_NAME,
        stateListHolder = nameHolders.STATE_LIST;

    let routeOutput = replaceTemplate(appPlaceHolder, appName, routeTemplate)
                    .replace(stateListHolder, stateOutput)
                    .produce();

    return routeOutput;
}

function replaceTemplate(placeHolder, replaceWithStr, str){
    var find = '{{' + placeHolder + '}}';
    //find = placeHolder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var result = str.replace(new RegExp(find, 'g'), replaceWithStr);

    return {
        replace: function(placeHolder, replaceWithStr){
            return replaceTemplate(placeHolder,replaceWithStr,result);
        },
        produce: function(){
            return result;
        }
    }
}


function clone(o) {
  var ret = [];
  Object.keys(o).forEach(function (val) {
    ret[val] = o[val];
  });
  return ret;
}

function onlyNumber(str){
    let re = /[0-9]{1,16}/; 
    if (re.test(str)) {
        return true;
    }
    else {
        return false;
    }
}

gulp.task('construct',function(){
    render();
    return gulp;
})

