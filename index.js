var app = require('express')();
var http = require('http').createServer(app);
var io = require("socket.io")(http);

var online = new Array();
var user = "User";
var id = 1;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on("connection", function(socket) {
    var nickname = user + id;
    console.log("A user has connected: " + nickname);
    id+=1;
    online.push(nickname);    
    io.emit("users", online);

    socket.on("disconnect", function() {
        console.log("A user has disconnected"); 
    })
    socket.on("chat message", function(msg) {
        console.log("message: " + msg);
        var msg_detail = new Object();
        msg_detail.date = new Date(Date.now());
        console.log(msg_detail.date);
        msg_detail.nick = nickname;
        msg_detail.message = msg;
        console.log(msg_detail);
        io.emit('chat message',  msg_detail);

    })

}); 
    
http.listen(3000, function() {
    console.log("listening on *:300");
});