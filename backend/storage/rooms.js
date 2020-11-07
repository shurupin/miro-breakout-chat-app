const {boards} = require('./boards')

const getRooms = () => {
	const result = []
	for (const [boardId, rooms] of Object.entries(boards)) {
		for (const [roomId, room] of Object.entries(rooms)) {
			result.push({
				boardId,
				roomId,
				createdAt: room.createdAt,
				users: Object.values(room.sockets).map((socket) => socket.name),
			})
		}
	}
	return result
}
module.exports.getRooms = getRooms
