const chatMessage = (io, roomId) => (msg, userName) => {
	try {
		io.to(roomId).emit('chat message', msg, userName)
	} catch (error) {
		console.log('Chat message error', error, {userName, roomId})
		throw error
	}
}
module.exports.chatMessage = chatMessage
