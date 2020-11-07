import {CLIENT_ID} from '../../config'
import type {Board} from '../interfaces/board'
import type {User} from '../interfaces/user'

export const getBoard = async (): Promise<Board> => {
	const boardInfo: SDK.IBoardInfo = await miro.board.info.get()
	const board: Board = {id: boardInfo.id, hasReadAndWritePermissions: boardInfo.currentUserPermissions?.length > 0}
	return board
}

export const getRoomId = async (): Promise<string> => {
	const runtimeState = await miro.__getRuntimeState()
	const roomId = runtimeState[CLIENT_ID] ? runtimeState[CLIENT_ID].breakoutChatRoomId : null
	return roomId
}

export const getCurrentUser = async (): Promise<User> => {
	const id = await miro.currentUser.getId()
	const token = await miro.getToken()
	// @ts-ignore
	const onlineUsers = await miro.board.getOnlineUsers()
	const onlineUser = onlineUsers?.find((user) => !!user && user.id === id)
	const user: User = onlineUser ? {id, name: onlineUser.name, token} : null
	return user
}
