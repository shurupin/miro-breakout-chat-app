import {getBoard, getRoomId, getCurrentUser} from '../common/implementations/methods'
import Chat from './components/Chat/Chat.svelte'
import Error from './components/Error.svelte'
import initChat from './controllers/socketIoController'
import type {User} from '../common/interfaces/user'

const initApp = (boardId: string, roomId: string, user: User) => {
	const app = new Chat({
		target: document.body,
		props: {
			boardId,
			roomId,
			user,
			chatFactory: initChat,
		},
	})
}

miro.onReady(async () => {
	const board = await getBoard()
	const roomId = await getRoomId()
	const user = await getCurrentUser()
	if (board.id && roomId && user) {
		initApp(board.id, roomId, user)
	} else {
		const app = new Error({
			target: document.body,
		})
	}
})
