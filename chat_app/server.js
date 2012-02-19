var connect = require("connect");
var sio = require("socket.io");

connect(connect.static(__dirname + "/public")).listen(8000, function(){
	console.log("static server listening on port 8000");
});


var io = sio.listen(1337,function(){
	console.log("socket server listening on port 1337");
});

var users = {};


io.sockets.on("connection", function(socket){
	console.log("someone connected");

	socket.on("setname",function(name,fn){
		if(users[name]){
			fn(true);
		}
		else{
			fn(false)
			users[name] = socket.name = name;
			socket.broadcast.emit("announcement", name + " connected.");
		}

		socket.emit("nameset",name);
	});

	socket.on("message",function(message){
		io.sockets.emit("message", socket.name + ": " + message);
	});
});
