var connect = require("connect");
var sio = require("socket.io");

var staticPort = 8000;
var sioPort = 1337;

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


function handleSetname(name,fn){
	if(users[name]){
		fn(true);
	} else {
		fn(false);
		users[name] = socket.name = name;
		this.broadcast.emit("announcement", name + " connected.");
		io.sockets.emit("users",users);
	}
	this.emit("nameset",name);
}
function handleGetUsers(){
	this.emit("users", users);
}
function handleMessage(message){
	io.sockets.emit("message", socket.name + ": " + message);
}
function handleDisconnect(){
	if(this.name && users[this.name])
	{
		delete users[this.name];
	}
	this.broadcast.emit("announcement", this.name + " disconnected.");
	io.sockets.emit("users",users);
}
function handleSocketConnect(socket){
	socket.on("setname", handleSetname);
	socket.on("getUsers", handleGetUsers);
	socket.on("message", handleMessage);
	socket.on("disconnect", handleDisconnect);
}
io.sockets.on("connection", handleSocketConnect);
