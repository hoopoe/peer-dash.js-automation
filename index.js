var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();

var port = process.env.PORT || 5002;

app.use(serveStatic('app'));

app.listen(port, function() {
  console.log("Server listening on port " + port);
});


// var requestify = require('requestify');
// var peerServerUrl = "http://localhost:9000/peerjs/list";

// var args = require('minimist')(process.argv.slice(2), {string: "action"});

// function printHelp() {
// 	console.log("");
// 	console.log("--help\t\t prints help");
// 	console.log("--action\t\t [list]");
// 	console.log("");
// }

// if (args.help || !args.action) {
// 	printHelp();
// 	process.exit(1);
// }

// var cmd = args.action

// function getPeers() {
// 	requestify.get(peerServerUrl).then(function(response) {   
// 	    response.getBody();    
// 	    response.body;
// 	    console.log(response.body);
// 	});	
// }

// switch(cmd)
// {
// case 1:

//   break;
// case 2:

//   break;
// default:
//   getPeers();
// }