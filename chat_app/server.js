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
// MySocket
//  events
//  listener
//  setname
//  getUsers
//  message
//  disconnect
// socket connection listener



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


function PrivateCell(val){
 var value = {val: val};
 function set(val){
  var result = get();
  value.val = val;
  return result;
 }
 function get(){
  return value.val;
 }
 function getKey(key){
  return get()[key];
 }
 function setKey(key, val){
  var result = getKey(key);
  get()[key] = val;
  return result;
 }
 function delKey(key){
  var result = getKey(key);
  var got = get();
  if(key in got)
   delete got[key];
  return result;
 }
 this.set = set;
 this.get = get;
 this.getKey = getKey;
 this.setKey = setKey;
 this.delKey = delKey;
}
var users = new PrivateCell({});
var setUser = users.setKey;
var getUser = users.getKey;
var delUser = users.delKey;
delete users.set;


//a class for our sockets
function MySocket(socket){
	this.socket = socket;
	for(var i = 0; i < this.events.length; i++)
		this.listenOn(this.events[i]);
}
MySocket.prototype.events = [
	"setname",
	"getUsers",
	"message",
	"disconnect"
];
MySocket.prototype.listenOn = function listenOn(name){
	this.socket.on(name, this[name]);
}
MySocket.prototype.setname = function setname(name, fn){
	if(getUser(name)){
		fn(true);
	} else {
		fn(false);
		setUser(this.name = name);
		this.broadcast.emit("announcement", name + " connected.");
		io.sockets.emit("users", users.get());
	}
	this.emit("nameset", name);
}
MySocket.prototype.getUsers = function getUsers(){
	this.emit("users", users.get());
}
MySocket.prototype.message = function message(message){
	io.sockets.emit("message", this.name + ": " + message);
}
MySocket.prototype.disconnect = function disconnect(){
	if(this.name)
	{
		delUser(this.name);
	}
	this.broadcast.emit("announcement", this.name + " disconnected.");
	io.sockets.emit("users", users.get());
}


io.sockets.on(
	"connection",
	function connection(socket){
		return new MySocket(socket);
	}
);
