import io from 'socket.io-client'

import {CHAT_HOST, CHAT_OPTIONS} from '../../config'

import type {ChatSettings, ChatController} from '../../common/interfaces/chat'

const initChat = ({boardId, roomId, user, messageHandler}: ChatSettings) => {
	const chatOptions = {...CHAT_OPTIONS, query: {boardId, token: user.token}}
	const socket = io(CHAT_HOST, chatOptions)

	socket.emit('join', boardId, roomId, user, () => {})

	socket.on('chat message', messageHandler)

	return {
		sendMessage: (msg: string) => {
			socket.emit('chat message', msg, user.name, () => {})
		},
	} as ChatController
}

export default initChat
