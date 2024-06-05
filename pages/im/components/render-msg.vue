/**
* 消息渲染组件
* @author ghost
*/

<template>
	<view
		:class="['msg-item',message.msgType == MsgTypeEnum.TIP? 'center' : currentUser.userId == message.user.userId ? 'right':'left']">
		<view v-if="message.msgType == MsgTypeEnum.TIP" class="msg-tip msg-box">
			{{ message.msg }}
			<text v-if="message.msg.indexOf('撤回')!=-1 && message.ext" class='rewrite-box' @click='rewriteFun(item.ext)'>
				重新编辑
			</text>
		</view>
		<view v-else class="message-item">
			<view class="avatar" v-if="currentUser.userId != message.user.userId" v-html="message.user.userAvatar"></view>
			<view class="message">
				<view class="name" :style="{textAligh: currentUser.userId == message.user.userId ? 'right': 'left'}">
					{{ message.user.userName }}</view>
				<view class="message-box" :class="currentUser.userId == message.user.userId ? 'right-after': 'left-after'">
					<component :is="getMessageType()" v-bind="getProps"></component>
				</view>
			</view>
			<view class="avatar" v-if="currentUser.userId == message.user.userId" v-html="message.user.userAvatar"></view>
			<loading v-if="message.msgStatus === MsgStatusEnum.PENDING" class="mine-load" />
		</view>
		
	</view>
</template>

<script lang="ts" setup>
	import loading from "./loading.vue"
	import { defineProps, onMounted, computed } from 'vue'
	import text from './text.vue'
	import image from './image.vue'
	import voice from './voice.vue'
	import video from './video.vue'
	import MsgTypeEnum from "@/enums/MsgTypeEnum"
	import MsgStatusEnum from "@/enums/MsgStatusEnum"
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
			default: () => { }
		},
		currentUser: {
			type: Object,
			default: () => { }
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

	// 重新编辑
	const rewriteFun = (ext : any) => {
		// imCharRef.value && imCharRef.value.rewriteFun(ext)
	}

	// 获取消息组件props
	const getProps = computed(() => {
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
	})

	onMounted(() => {
	})
</script>

<style lang="scss" scoped>
	.msg-item {
		display: flex;
		padding: 23rpx 30rpx;
		margin-top: 10px;
		width: 100%;

		&:first-child {
			margin-top: 5px;
		}
	}

	::v-deep .emo-image {
		height: 40rpx;
		width: 40rpx;
		vertical-align: middle;
		display: inline-block;
	}
	.msg-tip {
		text-align: center;
		font-size: 24rpx;
		color: #ccc;
		margin: 0 auto;
	}

	.message-item {
		border-radius: 10px;
		position: relative;
		display: flex;
		flex-direction: row;
		
		.mine-load {
			position: absolute;
			left: -20rpx;
			top: calc(50% + 26rpx);
			transform: translateY(-50%);
		}

		.avatar {
			display: flex;
			width: 80rpx;
			height: 80rpx;
			position: relative;
			box-shadow: 0 2px 12px 0 var(--avatar-shadow);
			border-radius: 50px;
		}

		.message {
			display: flex;
			margin-right: 20px;
			margin-left: 20px;
			flex-direction: column;
			.name{
				color: var(--txt-color);;
			}
			.message-box {
				margin-top: 5px;
				background-color: var(--im-txt-bg);
				border-radius: 5px;
				padding: 10px;
				color: var(--text-message-color);
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: 500;
				max-width: 486rpx;
				word-wrap: break-word;

				view {
					flex: auto;
					max-width: 486rpx;
					word-wrap: break-word;
				}



			}

			.right-after {
				&::after {
					position: absolute;
					display: inline-block;
					content: '';
					width: 0;
					height: 0;
					left: 602rpx;
					top: 45px;
					border: 12rpx solid transparent;
					border-left: 20rpx solid var(--text-message-bg);
				}
			}

			.left-after {
				&::after {
					position: absolute;
					display: inline-block;
					content: '';
					width: 0;
					height: 0;
					top: 45px;
					right: 602rpx;
					border: 12rpx solid transparent;
					border-right: 20rpx solid var(--text-message-bg);
				}
			}
		}
	}

	.left {
		justify-content: flex-start;
		text-align: left;
	}

	.right {
		justify-content: flex-end;
		text-align: right;
	}

	.center {
		justify-content: center;
	}
</style>