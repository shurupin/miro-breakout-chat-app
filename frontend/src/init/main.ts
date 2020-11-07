import {CLIENT_ID} from '../config'
import {getBoard} from '../common/implementations/methods'
import appIcon from './icon'

const initChat = (breakoutChatRoomId: string) => {
	miro.__setRuntimeState({
		[CLIENT_ID]: {
			breakoutChatRoomId,
		},
	})

	miro.board.ui.closeLeftSidebar()
	miro.board.ui.openLeftSidebar('/chat')
}

const handleAddChatClick = async () => {
	const viewport = await miro.board.viewport.get()

	const widget = (
		await miro.board.widgets.create({
			type: 'SHAPE',
			text: 'click to join a breakout chat',
			width: 300,
			style: {
				shapeType: 6,
				backgroundColor: '#fff',
				fontFamily: miro.enums.fontFamily.PERMANENT_MARKER,
				borderWidth: 7,
			},
			metadata: {
				[CLIENT_ID]: {
					isBreakoutChatButton: true,
				},
			},
			x: viewport.x + viewport.width / 2,
			y: viewport.y + viewport.height / 2,
		})
	)[0]

	// @ts-ignore
	miro.board.viewport.zoomToObject(widget)

	initChat(widget.id)
}

const initPlugin = async () => {
	let onClick: () => Promise<void>
	const board = await getBoard()
	if (board.hasReadAndWritePermissions) {
		// @ts-ignore
		miro.addListener(miro.enums.event.SELECTION_UPDATED, async () => {
			const widgets = await miro.board.selection.get()
			if (widgets.length === 1 && widgets[0].metadata[CLIENT_ID]?.isBreakoutChatButton) {
				initChat(widgets[0].id)
			}
		})
		onClick = handleAddChatClick
	} else {
		onClick = () => miro.showNotification('You do not have enough permissions to load the chat :(')
	}

	await miro.initialize({
		extensionPoints: {
			bottomBar: {
				title: 'Create a new breakout chat',
				svgIcon: appIcon,
				onClick,
			},
		},
	})
}

miro.onReady(async () => {
	const authorized = await miro.isAuthorized()
	if (authorized) {
		initPlugin()
	} else {
		const res = await miro.board.ui.openModal('/not-authorized.html')
		if (res === 'success') {
			initPlugin()
		}
	}
})
