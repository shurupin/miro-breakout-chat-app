var express = require('express')
var app = express()
var cors = require('cors')
var http = require('http').Server(app)
var socketConfig = require('./sockets/config')
var io = require('socket.io')(http, socketConfig)
var port = process.env.PORT || 8081

const {getRooms} = require('./storage/rooms')
const {join} = require('./sockets/handlers/join')

app.use(cors())

app.get('/rooms/:roomId', (req, res) => {
	const {roomId} = req.params
	const rooms = getRooms()
	const room = rooms.find((room) => room.roomId === roomId)

	if (room) {
		res.json(room)
	} else {
		res.status(404).send('Not found')
	}
})

app.get('/rooms', (req, res) => {
	const rooms = getRooms()
	res.json(rooms)
})

io.on('connection', (socket) => {
	socket.on('join', join(io, socket))
})

http.listen(port, '0.0.0.0', () => {
	console.log('listening on *:' + port)
})
