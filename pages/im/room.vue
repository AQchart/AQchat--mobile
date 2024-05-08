<template>
	<view class="chat">
		<scroll-view :style="{height: `${windowHeight}rpx`}" id="scrollview" scroll-y="true" :scroll-top="scrollTop"
			:scroll-with-animation="true" class="scroll-view">
			<!-- 聊天主体 -->
			<view id="msglistview" class="chat-body">
				<!-- 聊天记录 -->
				<render-msg class="item" v-for="(msg, index) in msgList" :key="index" :message="msg"
					:currentUser="appStore.userInfo"></render-msg>
			</view>
		</scroll-view>
		<!-- 底部消息发送栏 -->
		<!-- 用来占位，防止聊天消息被发送框遮挡 -->
		<view class="chat-bottom">
			<view class="send-msg">
				<view class="uni-textarea">
					<textarea v-model="msgStr" maxlength="300" :show-confirm-bar="false" auto-height></textarea>
				</view>
				<view class="send-btn">
					<u-icon @click="showEmoji()" custom-prefix="custom-icon" name=" icon-emoji" class="plus"></u-icon>
					<u-icon @click="showOther()" v-if="!showSend" name="plus" class="plus"></u-icon>
					<button @click="sendTextMsg" v-if="showSend" class="send">发送</button>
				</view>
			</view>
		</view>
		<view v-if="otherShow" class="message-other"></view>
	</view>
</template>

<script setup lang="ts">
	import renderMsg from './components/render-msg.vue'
	import { ref, onMounted, computed } from 'vue'
	import { useAppStore } from '../../store/modules/app'
	import useChart from './hook/useChat'
	const appStore = useAppStore()

	const {
		sendMessageFun,
		reciveMessageFun
	} = useChart()

	const scrollTop = ref(0)

	const otherShow = ref(false)
	
	const emojiShow = ref(false)

	const msgStr = ref('')

	const showOther = () => {
		otherShow.value = true
	}
	
	const showEmoji = () => {
		emojiShow.value = true
	}

	const msgList = computed(() => {
		return appStore.msgQueue
	})
	
	const showSend = computed(() => {
		return msgStr.value.length > 0
	})

	const rpxTopx = (px : number) => {
		let deviceWidth = wx.getSystemInfoSync().windowWidth
		let rpx = (750 / (deviceWidth - 30)) * Number(px)
		return Math.floor(rpx)
	}

	const windowHeight = computed(() => {
		return rpxTopx(uni.getSystemInfoSync().windowHeight)
	})

	// 发送文本消息
	const sendTextMsg = () => {
		if (msgStr.value == '' || msgStr.value == null || !msgStr.value) {
			uni.showToast({
				title: '请输入消息',
				icon: 'exception'
			})
			return
		}
		sendMessage(0, msgStr.value)
	}

	// 组装和发送消息
	const sendMessage = (type : number, msg : string) => {
		const data = {
			roomId: appStore.roomInfo.roomId,
			msgType: type,
			msg: msg
		}
		sendMessageFun(data)
	}




	onMounted(() => {
		// 注册消息回调
		reciveMessageFun()
		uni.setNavigationBarTitle({
			title: appStore.roomInfo.roomName
		})
	})
</script>

<style lang="scss" scoped>
	$chatContentbgc: #C2DCFF;
	$sendBtnbgc: #4F7DF5;

	view,
	button,
	text,
	input,
	textarea {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	/* 聊天消息 */
	.chat {
		.scroll-view {
			::-webkit-scrollbar {
				display: none;
				width: 0 !important;
				height: 0 !important;
				-webkit-appearance: none;
				background: transparent;
				color: transparent;
			}

			// background-color: orange;
			background-color: #F6F6F6;

			.chat-body {
				display: flex;
				flex-direction: column;
				padding-top: 23rpx;
				
				.item {
					margin-top: 10px;
					&:first-child {
						margin-top: 5px;
					}
				}
			}
		}

		/* 底部聊天发送栏 */
		.chat-bottom {
			width: 100%;
			background: #F4F5F7;

			.send-msg {
				display: flex;
				align-items: flex-end;
				padding: 16rpx 30rpx;
				width: 100%;
				position: fixed;
				bottom: 0;
				background: #EDEDED;
			}

			.uni-textarea {
				textarea {
					width: 500rpx;
					min-height: 75rpx;
					max-height: 500rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					font-size: 32rpx;
					font-family: PingFang SC;
					color: #333333;
					line-height: 43rpx;
					padding: 5rpx 8rpx;
				}
			}

			.send-btn {
				display: flex;
				flex: 0 0 auto;
				margin-left: 25rpx;
				height: 75rpx;
				.send {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 108rpx;
					height: 65rpx;
					margin-left: 5px;
					background: $sendBtnbgc;
					border-radius: 8rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 28rpx;
				}
				.plus {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 65rpx;
					height: 65rpx;
					margin-left: 5px;
					background: $sendBtnbgc;
					border-radius: 50rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					line-height: 28rpx;
				}
			}
		}

	}
</style>