var app = require('express')();
var http = require('http').createServer(app);
var io = require("socket.io")(http, {pingTimout: 3600000000000000000000 });

var online = new Array();
var user = "User";
var id = 1;
var messages = new Array();

app.get('/', function(req, res) {
    console.log("Sending file..");
    res.sendFile(__dirname + '/index.html');
    console.log("Sent file!");


});

io.on("connection", function(socket) {
    var nickname = user + id;
    var color = '';
    var hex;
    var red = 0;
    var green = 0;
    var blue = 0;

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
        var now = new Date(Date.now());
        var id = socket.id;
        msg_detail.date = now.toLocaleString();
        if (msg.startsWith('/')) {
            var cmd = msg.split(' ')[0];
            if(cmd === '/nick') {
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
            else if (cmd === '/nickcolor') {
                hex = msg.split(' ')[1];
                var color_array = hex.match(/.{1,2}/g);
                red = color_array[0];
                green = color_array[1];
                blue = color_array[2];
                color = color.concat("#", red, green, blue);
            }
        }



        msg_detail.nick = nickname;
        msg_detail.message = msg;
        msg_detail.id = id;
        msg_detail.color = color;
        messages.push(msg_detail);
        console.log(messages);
        io.emit('chat message',  msg_detail);

    })

}); 
    
http.listen(3000, function() {
    console.log("listening on *:3000");
});