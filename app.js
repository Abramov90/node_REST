var http = require('http');
var url = require('url');
var querystring = require('querystring');
var config = require('./config');
var db = require('./db');

var server = http.createServer().listen(config.port);

server.on('request', function(request, response) {
    var methodsMap = {
        'GET': db.read,
        'POST': db.insert,
        'PUT': db.update,
        'DELETE': db.drop
    };
    var params = querystring.parse(url.parse(request.url).query);
    var method = methodsMap[request.method];
    if (params) {
        method(params, response);
    } else {
        response.write('Hello world!');
        response.end();
    }
});