const {boards} = require('../../storage/boards')

const disconnect = (io, socket, boardId, roomId, user) => () => {
	try {
		io.to(roomId).emit('system message', `${user.name} left ${roomId}`)

		//Remove socket, room and board
		delete boards[boardId][roomId].sockets[socket.id]
		if (!Object.keys(boards[boardId][roomId].sockets).length) {
			delete boards[boardId][roomId]
		}
		if (!Object.keys(boards[boardId]).length) {
			delete boards[boardId]
		}
	} catch (error) {
		console.log('Disconnect error', error, {userName: user.name, boardId, roomId, socketId: socket.id})
		throw error
	}
}
module.exports.disconnect = disconnect
