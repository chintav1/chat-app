var app = require('express')();
var http = require('http').createServer(app);
var io = require("socket.io")(http);

var online = new Array();
var user = "User";
var id = 1;

app.get('/', function(req, res) {
    console.log("Sending file..");
    res.sendFile(__dirname + '/index.html');
    console.log("Sent file!");


});

io.on("connection", function(socket) {
    var nickname = user + id;
    console.log("A user has connected: " + nickname);
    id+=1;
    online.push(nickname);
    io.emit("users", online);    


    socket.on("disconnect", function() {
        console.log("A user has disconnected");
        var index = online.indexOf(nickname);
        var removed = online.splice(index, 1);
        io.emit("users", online);
    })
    socket.on("chat message", function(msg) {
        console.log("message: " + msg);
        var msg_detail = new Object();
        var now = new Date(Date.now())
        msg_detail.date = now.toLocaleString();
        if(msg.startsWith('/nick ')) {
            var new_nickname = msg.split(" ")[1];
            if (!online.includes(new_nickname)) {
                var index = online.indexOf(nickname);
                nickname = new_nickname;
                online[index] = nickname;   
                io.emit("users", online);
            }
            else {
                socket.emit("nick_error");
            }
        }
        msg_detail.nick = nickname;
        msg_detail.message = msg;
        console.log(msg_detail);
        io.emit('chat message',  msg_detail);

    })

}); 
    
http.listen(3000, function() {
    console.log("listening on *:3000");
});