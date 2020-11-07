const {boards} = require('../../storage/boards')
const {chatMessage} = require('./chatMessage')
const {disconnect} = require('./disconnect')
const {isAuthorized} = require('../../authorization/authorization')

const join = (io, socket) => async (boardId, roomId, user, callback) => {
	try {
		if (!boardId || !roomId || !user) {
			if (callback) {
				callback('boardId and roomId and user params are required')
			}
			console.warn(`${socket.id} is attempting to connect without boardId or roomId or user`, {boardId, roomId, user})
			return
		}

		const authorized = await isAuthorized(socket, boardId)
		if (!authorized) {
			console.warn(`${user.name} is attempting to connect without authorization`)
			if (callback) {
				callback('authorization is required')
			}
			return
		}

		//Add board, room and socket
		boards[boardId] = boards[boardId] || {}
		boards[boardId][roomId] = boards[boardId][roomId] || {createdAt: new Date(), sockets: {}}
		boards[boardId][roomId].sockets[socket.id] = boards[boardId][roomId].sockets[socket.id] || {socket, name: user.name}

		socket.join(roomId)

		io.to(roomId).emit('system message', `${user.name} joined ${roomId}`)

		socket.on('chat message', chatMessage(io, roomId))
		socket.on('disconnect', disconnect(io, socket, boardId, roomId, user))

		if (callback) {
			callback(null, {success: true})
		}
	} catch (error) {
		console.log('Join error', error, {userName: user?.name, boardId, roomId, socketId: socket.id})
		throw error
	}
}
module.exports.join = join
