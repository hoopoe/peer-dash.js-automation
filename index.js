var requestify = require('requestify');
var peerServerUrl = "http://localhost:9000/peerjs/list";

var args = require('minimist')(process.argv.slice(2), {string: "command"});
var cmd = args.command

var getPeers = function () {
	requestify.get(peerServerUrl).then(function(response) {   
	    response.getBody();    
	    response.body;
	    console.log(response.body);
	});	
}

switch(cmd)
{
case 1:
  
  break;
case 2:
  
  break;
default:
  getPeers();
}
