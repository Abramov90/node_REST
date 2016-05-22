var fs = require('fs');
var json = require('jsonfile');
var config = require('../config');

var db = (function() {
    
    var PATH = config.dbPath;
    
    var read = function(params, response) {
        params = __parseParams(params);
        json.readFile(PATH, 'utf8', function(error, data) {
            var result = {};
            params.forEach(function(param) {
                if (data[param]) result[param] =  data[param];   
            });
            response.write(JSON.stringify(result));
            response.end();
        });
    };
    
    var insert = function(params, response) {
       __rewrite(params, response);
    };
    
    var update = function(params,response) {
        __rewrite(params, response, true);
    };
    
    var drop = function(params, response) {
        __rewrite(__parseParams(params), response, false, true);            
    };
    
    function __rewrite(params, response, override, drop) {
         json.readFile(PATH, 'utf8', function(error, data) {
            var fileObj = data;
            var keys = drop ? params : Object.keys(params);
            keys.forEach(function(key) {
                if (!!fileObj[key] && drop) {
                    delete fileObj[key];
                } else if (!drop) {
                    fileObj[key] = (!!override ? '' : (fileObj[key] || '')) + params[key];
                }
            });
            json.writeFile(PATH, fileObj, function(error) {
                if (error) {
                    throw error;
                } else {
                    response.write('Data updated succesfuly \n');
                    response.write(JSON.stringify(fileObj));
                    response.end();
                }
            });
        });
    }
    
    function __parseParams(params) {
        return params.keys && params.keys.length ? params.keys.split(',') : params;
    }
    
    return {
        read: read,
        insert: insert,
        update: update,
        drop: drop      
    };
})();

module.exports = db;