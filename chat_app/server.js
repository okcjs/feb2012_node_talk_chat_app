//Contents
// Contents
// modules
// configuration
// servers
//  connect
//  socket.io
// users
//  setUser
//  getUser
//  delUser
// socket handlers
//  setname
//  getUsers
//  message
//  disconnect
//  connect


//modules
var connect = require("connect");
var sio = require("socket.io");

//configuration
var staticPort = 8000;
var sioPort = 1337;

//servers

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
function setUser(name){
	var result = getUser(name);
	users[name] = name;
	return result;//returns the old value
}
function getUser(name){
	return users[name];
}
function delUser(name){
	var result = getUser(name);
	if(name in users)
		delete users[name];
	return result;//returns the old value
}


//socket handlers
function handleSetname(name,fn){
	if(getUser(name)){
		fn(true);
	} else {
		fn(false);
		setUser(socket.name = name);
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
	if(this.name)
	{
		delUser(this.name);
	}
	this.broadcast.emit("announcement", this.name + " disconnected.");
	io.sockets.emit("users",users);
}
function handleSocketConnect(socket){
	return new MySocket(socket);
}

//our sockets as a class
function MySocket(socket){
	this.socket = socket;
	for(var k in this.callbacks)
		this.socket.on(k, this[k]);
}
MySocket.prototype.callbacks = {
	setname: handleSetname,
	getUsers: handleGetUsers,
	message: handleMessage,
	disconnect: handleDisconnect
};
MySocket.prototype.setname = handleSetname;
MySocket.prototype.getUsers = handleGetUsers;
MySocket.prototype.message = handleMessage;
MySocket.prototype.disconnect = handleDisconnect;


io.sockets.on("connection", handleSocketConnect);
