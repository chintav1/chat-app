var app = require('express')();
var http = require('http').createServer(app);
var io = require("socket.io")(http);
var online = new Array();
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on("connection", function(socket) {
    
    console.log("A user has connected");
    
    
    
    socket.on("disconnect", function() {
        console.log("A user has disconnected"); 
    })
    socket.on("chat message", function(msg) {
        console.log("message: " + msg);
        io.emit('chat message', msg); 
    })

}); 
    
http.listen(3000, function() {
    console.log("listening on *:300");
});