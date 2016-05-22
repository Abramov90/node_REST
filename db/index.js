var fs = require('fs');
var json = require('jsonfile');

var db = (function() {
    
    var PATH = './db/base/index.json';
    
    var read = function(params, response) {
        var result = {};
        params = params.keys && params.keys.length ? params.keys.split(',') : params;
        json.readFile(PATH, 'utf8', function(error, data) {
            for (var key in data) {
                if (data[key]) result[key] = data[key];
            }
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
        params = params.keys && params.keys.length ? params.keys.split(',') : params;
        __rewrite(params, response, false, true);            
    };
    
    var __rewrite = function(params, response, override, drop) {
         json.readFile(PATH, 'utf8', function(error, data) {
            var fileObj = data;
            var keys = drop ? params : Object.keys(params);
            keys.forEach(function(key) {
                console.log(!!fileObj[key] && drop);
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
    };
    
    return {
        read: read,
        insert: insert,
        update: update,
        drop: drop      
    };
})();

module.exports = db;