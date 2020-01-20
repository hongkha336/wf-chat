// var path = require("path");
// var express = require("express");
// var app = express();
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);

// app.use(express.static(__dirname + '/public'));
// // app.use(express.static(__dirname + '/assets/css'));
// app.use(express.static('.'));
// // //Tạo router
// // app.get("/", function (req, res) {
// //     res.sendFile(path.join(__dirname + '/chat.html'));
// // });

// //Tạo socket 
// io.on('connection', function (socket) {
//     console.log('Welcome to server chat');

//     socket.on('send', function (data) {
//         io.sockets.emit('send', data);
//     });
// });

// //Khởi tạo 1 server listen tại 1 port
// server.listen(3000);
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.static('.'))
app.use(express.urlencoded({ extended: true }))

const rooms = { }

app.get('/', (req, res) => {
  res.render('index', { rooms: rooms })
})

app.post('/room', (req, res) => {
  if (rooms[req.body.room] != null) {
    return res.redirect('/')
  }
  rooms[req.body.room] = { users: {} }
  res.redirect(req.body.room)
  // Send message that new room was created
  io.emit('room-created', req.body.room)
})

app.get('/:room', (req, res) => {
  if (rooms[req.params.room] == null) {
    return res.redirect('/')
  }
  res.render('room', { roomName: req.params.room })
})

server.listen(3000)

io.on('connection', socket => {
  socket.on('new-user', (room, name) => {
    socket.join(room)
    rooms[room].users[socket.id] = name
    socket.to(room).broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', (room, message) => {
    socket.to(room).broadcast.emit('chat-message', { message: message, name: rooms[room].users[socket.id] })
  })
  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).broadcast.emit('user-disconnected', rooms[room].users[socket.id])
      delete rooms[room].users[socket.id]
    })
  })
})

function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id] != null) names.push(name)
    return names
  }, [])
}