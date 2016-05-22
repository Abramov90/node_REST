var config = (function() {
   
   var port = '3333'; 
   
   var dbPath = './db/base/index.json';
   
    return {
        port: port,
        dbPath: dbPath
    };
})();

module.exports = config;