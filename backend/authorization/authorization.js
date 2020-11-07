var fetch = require('node-fetch')

const isAuthorized = async (socket, boardId) => {
	try {
		const miroApi = process.env.MIRO_API || 'https://api.miro.com/v1'
		const getBoardEndpoint = `${miroApi}/boards/${boardId}`
		const {token} = socket.handshake.query
		const response = await fetch(getBoardEndpoint, {headers: {Authorization: `Bearer ${token}`}})
		const authorized = response?.status === 200
		return authorized
	} catch (error) {
		console.error('Authorization check error', error)
		return false
	}
}
module.exports.isAuthorized = isAuthorized
