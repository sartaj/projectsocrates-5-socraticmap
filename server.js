// require deployd
var deployd = require('deployd');

var PORT = process.env.PORT || 5000;
// configure database etc. 
var server = deployd({
  port: process.env.PORT || 5000,
  env: 'production',
  db: {
    host: 'ds061370.mongolab.com',
    port: 61370,
    name: 'heroku_app25276838',
    credentials: {
      username: 'dbuser',
      password: 'dbuser'
    }
  }
});

// heroku requires these settings for sockets to work
server.sockets.manager.settings.transports = ["xhr-polling"];

// start the server
server.listen();

// debug
server.on('listening', function() {
  console.log("Server is listening on port: " + PORT);
});

// Deployd requires this
server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});