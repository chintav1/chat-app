var app = require('express')();
var http = require('http').createServer(app);
var io = require("socket.io")(http);

var online = new Array();
var user = "User";
var number = 1;
var messages = new Array();

app.get('/', function(req, res) {
    console.log("Sending file..");
    res.sendFile(__dirname + '/index.html');
    console.log("Sent file!");
});

io.on("connection", function(socket) {
    var user_info = new Object();
    var user_id = socket.id;
    var nickname = user + number;
    var color = '';
    var hex;
    var red = 0;
    var green = 0;
    var blue = 0;
    console.log("A user has connected: " + nickname);
    user_info.nick = nickname;
    user_info.id = user_id;
    online.push(user_info);
    number+=1;
    io.emit("users", online);

    if (messages.length > 0) {
        socket.emit("chat log", messages);
    }
    socket.on("disconnect", function() {
        console.log("A user has disconnected");
        var index = online.indexOf(nickname);
        online.splice(index, 1);
        io.emit("users", online);
    })
    socket.on("chat message", function(msg) {
        var msg_detail = new Object();
        var now = new Date(Date.now());
        var msg_id = socket.id;
        msg_detail.date = now.toLocaleString();
        if (msg.startsWith('/')) {
            var cmd = msg.split(' ')[0];
            if(cmd === '/nick') {
                var new_nickname = msg.split(" ")[1];
                var taken = false;
                var id = socket.id;
                for (let i = 0; i < online.length; i++) {
                    var current = online[i];
                    var user_details = Object.values(current);
                    var user_nickname = user_details[0];
                    if (user_nickname === new_nickname) {
                        taken = true;
                    }
                    else {
                        continue;
                    }
                }
                if (taken === false) {
                    var index = online.findIndex(element => element.id === id);
                    var user_details = online[index];
                    nickname = new_nickname
                    user_details.nick = nickname;
                    online.splice(index, 1, user_details);
                    io.emit("users", online);
                }
                else {
                    socket.emit("nick_error");
                }
            }
            else if (cmd === '/nickcolor') {
                hex = msg.split(' ')[1];
                color = '';                             //clear previous color
                var color_array = hex.match(/.{1,2}/g); //split two characters at a time
                red = color_array[0];
                green = color_array[1];
                blue = color_array[2];
                color = color.concat("#", red, green, blue);
            }
        }



        msg_detail.nick = nickname;
        msg_detail.message = msg;
        msg_detail.id = msg_id;
        msg_detail.color = color;
        messages.push(msg_detail);
        console.log(messages);
        
        io.emit('chat message',  msg_detail);

    })

}); 
    
http.listen(3000, function() {
    console.log("listening on *:3000");
});