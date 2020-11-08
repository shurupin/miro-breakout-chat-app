<script lang="ts">
	import {afterUpdate, onMount} from 'svelte'
	import Message from './Message.svelte'
	import type {
		ChatController,
		ChatSettings,
		Message as MessageInterface,
		MessageHandler,
	} from '../../../common/interfaces/chat'
	import type {User} from '../../../common/interfaces/user'

	export let chatFactory: (settings: ChatSettings) => ChatController
	export let boardId: string
	export let roomId: string
	export let user: User

	let sidebarBody
	let newMessageText: string = ''

	let chatController: ChatController = null

	let messages: Array<MessageInterface> = []
	const handleNewMessage: MessageHandler = (text, author) => {
		messages = [...messages, {text, author, timestamp: new Date()}]
	}

	const handleMessageSend = () => {
		if (!newMessageText) return

		chatController.sendMessage(newMessageText)

		newMessageText = ''

		return false
	}

	onMount(() => {
		chatController = chatFactory({boardId, roomId, user, messageHandler: handleNewMessage})
	})

	afterUpdate(() => {
		sidebarBody.scrollTo(0, sidebarBody.scrollHeight)
	})
</script>

<style>
	.sidebar__container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}

	.sidebar__header {
		padding: 24px;
		height: 64px;
	}

	.sidebar__body {
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
		overflow-y: auto;
		height: calc(100% - 120px);
		padding: 0 24px;
	}

	.sidebar__footer {
		padding: 0 8px;
	}

	.sidebar__footer input {
		width: 100%;
	}
</style>

<div class="sidebar__container">
	<div class="sidebar__header"><span class="miro-h2">Breakout Chat</span></div>
	<div class="sidebar__body" bind:this={sidebarBody}>
		{#each messages as message}
			<Message {message} />
		{/each}
	</div>
	<div class="sidebar__footer">
		<form on:submit|preventDefault={handleMessageSend}>
			<input
				disabled={chatController === null}
				type="text"
				class="miro-input miro-input--primary"
				bind:value={newMessageText}
				placeholder="Type your message here" />
		</form>
	</div>
</div>
