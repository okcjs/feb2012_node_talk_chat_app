var connect = require("connect");
var sio = require("socket.io");

var staticPort = 8000;
var sioPort = 1337;

staticPort = 15215;
sioPort = 15216;

//the connect module acts as a factory function that takes middleware arguments
connect(
	connect.static(__dirname + "/public")
).listen(
	staticPort,
	function(){
		console.log("static server listening on port " + staticPort);
	}
);


var io = sio.listen(
	sioPort,
	function(){
		console.log("socket server listening on port " + sioPort);
	}
);

var users = {};


io.sockets.on("connection", function handleSocketConnect(socket){

	socket.on("setname",function(name,fn){
		if(users[name]){
			fn(true);
		} else {
			fn(false);
			users[name] = socket.name = name;
			this.broadcast.emit("announcement", name + " connected.");
			io.sockets.emit("users",users);
		}
		this.emit("nameset",name);
	});

	socket.on("getUsers",function(){
		this.emit("users",users);
	});
	
	socket.on("message",function(message){
		io.sockets.emit("message", socket.name + ": " + message);
	});

	socket.on("disconnect",function(){
		if(this.name && users[this.name])
		{
			delete users[this.name];
		}
		this.broadcast.emit("announcement", this.name + " disconnected.");	
		io.sockets.emit("users",users);
	});
});
