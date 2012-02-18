var connect = require("connect");

connect(connect.static(__dirname + "/public")).listen(8000, function(){
	console.log("static server listening on port 8000");
});
