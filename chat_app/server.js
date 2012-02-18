var connect = require("connect");
var io = require("socket.io");

connect(connect.static(__dirname + "/public")).listen(8000, function(){
	console.log("static server listening on port 8000");
});


var ioServer = io.listen(1337,function(){
	console.log("socket server listening on port 1337");
});

ioServer.sockets.on("connection", function(socket){
	console.log("someone connected");
	socket.emit("connection","hello someone");
});
