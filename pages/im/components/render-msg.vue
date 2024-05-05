/**
* 消息渲染组件
* @author ghost
*/

<template>
	<view class="message-item" :class="currentUser == message.user.userId ? 'right': 'left'">
		<view class="avatar" v-if="currentUser != message.user.userId" v-html="message.user.userAvatar"></view>
		<view class="message-box">
			<component :is="getMessageType()" :v-bind="getProps()"></component>
		</view>
		<view class="avatar" v-if="currentUser == message.user.userId" v-html="message.user.userAvatar"></view>
	</view>
</template>

<script lang="ts" setup>
	import { ref, defineProps } from 'vue'
	import text from './text.vue'
	import image from './image.vue'
	import voice from './voice.vue'
	import video from './video.vue'
	enum messageType {
		text = 0,
		image = 1,
		voice = 2,
		video = 3
	}

	// props
	const props = defineProps({
		message: {
			type: Object,
			default: {}
		},
		currentUser: {
			type: Object,
			default: undefined
		}
	})

	// 解析消息
	const { message, currentUser } = props

	// 获取消息组件
	const getMessageType = () => {
		switch (message.msgType) {
			case messageType.text:
				return text
			case messageType.image:
				return image
			case messageType.voice:
				return voice
			case messageType.video:
				return video
		}
	}

	// 获取消息组件props
	const getProps = () => {
		switch (message.msgType) {
			case messageType.text:
				return { text: message.msg }
			case messageType.image:
				return { src: message.msg }
			case messageType.voice:
				return { src: message.msg }
			case messageType.video:
				return { src: message.msg }
			default:
				return {}
		}
	}
</script>

<style lang="scss" scoped>
	.message-item {
		border-radius: 10px;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;


		.avatar {
			flex: 0 0 auto;
			width: 50px;
			height: 50px;
			position: relative;
			z-index: 1;
			box-shadow: 0 2px 12px 0 var(--avatar-shadow);
			border-radius: 50px;
		}

		.message-box {
			flex: 1 1 auto;
		}
	}

	.left {
		left: 5px;
	}

	.right {
		right: 5px;
	}
</style>