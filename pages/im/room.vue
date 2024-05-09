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
			<view class="send-msg" :class="(otherShow || emojiShow) ? 'send-msg-other': 'send-msg-only'">
				<view class="uni-textarea">
					<editor id="editor" class="ql-container" placeholder="输入内容..." @input="onEditorInput"
						:read-only="editorReadOny" @ready="onEditorReady">
					</editor>
				</view>
				<view class="send-btn">
					<u-icon @click="showEmoji()" custom-prefix="custom-icon" name=" icon-emoji" class="emoji"></u-icon>
					<u-icon @click="showOther()" v-if="!showSend" name="plus" class="plus"></u-icon>
					<button @click="sendTextMsg" v-if="showSend" class="send">发送</button>
				</view>
			</view>
		</view>
		<view v-if="otherShow" class="message-other">
			<scroll-view :style="{height: `200rpx`}" class="other-scroll-view" id="other-scroll-view" scroll-y="true"
				:scroll-with-animation="true">
				<ul>
					<li>
						<u-icon name="photo"></u-icon>
						<span>图片</span>
					</li>
					<li>
						<u-icon name="camera-fill"></u-icon>
						<span>视频</span>
					</li>
				</ul>
			</scroll-view>
		</view>
		<view v-if="emojiShow" class="message-other">
			<scroll-view :style="{height: `200rpx`}" class="emoji-scroll-view" id="emoji-scroll-view" scroll-y="true"
				:scroll-with-animation="true">
				<ul>
					<li v-for="item in emoList" :key="item.title" :title="item.title">
						<img :src="item.icon" @click="selectIcon(item)" />
					</li>
				</ul>
			</scroll-view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import renderMsg from './components/render-msg.vue'
	import { ref, onMounted, computed } from 'vue'
	import { useAppStore } from '../../store/modules/app'
	import useChart from './hook/useChat'
	import emoList from './hook/emo'
	const appStore = useAppStore()

	const {
		sendMessageFun,
		reciveMessageFun
	} = useChart()

	const scrollTop = ref(0)

	const otherShow = ref(false)

	const emojiShow = ref(false)

	const msgStr = ref('')

	const editorReadOny = ref(true)

	const showOther = () => {
		otherShow.value = !otherShow.value
		if (otherShow.value) {
			emojiShow.value = false
		}
	}

	const editorCtx = ref(null)


	const selectIcon = (icon : any) => {
		let imgObject = {
			src: icon.icon,
			alt: icon.title,
			width: '30rpx',
			height: '30rpx'
		}
		const context = uni.createSelectorQuery().select('#editor').context
		if (editorCtx.value != null) {
			editorCtx.value.insertImage(imgObject)
		}
	}

	const onEditorInput = (e : any) => {
		msgStr.value = e.detail.html
	}

	const onEditorReady = () => {
		editorReadOny.value = false
		uni.createSelectorQuery().select('#editor').context((res) => {
			editorCtx.value = res.context
		}).exec()
	}

	const showEmoji = () => {
		emojiShow.value = !emojiShow.value
		if (emojiShow.value) {
			otherShow.value = false
		}
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
		let px = uni.getSystemInfoSync().windowHeight;
		if (emojiShow.value || emojiShow.value) {
			px = px + rpxTopx(75)
		}
		else {
			px = px + rpxTopx(25)
		}
		return rpxTopx(px)
	})

	// 滚动至聊天底部
	const scrollToBottom = () => {
		setTimeout(() => {
			let query = uni.createSelectorQuery().in(this);
			query.select('#scrollview').boundingClientRect();
			query.select('#msglistview').boundingClientRect();
			query.exec((res) => {
				if (res[1].height > res[0].height) {
					scrollTop.value = rpxTopx(res[1].height - res[0].height)
				}
			})
		}, 15)
	}

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
		msgStr.value = ''
		editorCtx.value.clear({})
		scrollToBottom()
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
		setTimeout(() => {
			scrollToBottom()
		}, 500)
	})
</script>

<style lang="scss" scoped>
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

			background-color: #F6F6F6;

			.chat-body {
				display: flex;
				flex-direction: column;
				padding-top: 23rpx;

				.item {
					display: flex;
					padding: 23rpx 30rpx;
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
			background: var(--input-out-bg);

			.send-msg-only {
				bottom: 0;
			}

			.send-msg-other {
				bottom: 200rpx;
			}

			.send-msg {
				display: flex;
				align-items: flex-end;
				padding: 16rpx 30rpx;
				width: 100%;
				position: fixed;
				background: var(--input-out-bg);
			}

			.uni-textarea {
				.ql-container {
					width: 500rpx;
					height: auto;
					min-height: 75rpx;
					max-height: 500rpx;
					background: var(--input-inner-bg);
					border-radius: 8rpx;
					font-size: 32rpx;
					font-family: PingFang SC;
					color: var(--input-text-color);
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
					background: var(--send-btn-bg);
					border-radius: 8rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: var(--send-btn-color);
					line-height: 28rpx;
				}

				.plus {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 65rpx;
					height: 65rpx;
					margin-left: 5px;
					background: var(--plus-bg);
					border-radius: 50rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: var(--plus-icon-color);
					line-height: 28rpx;
				}

				.emoji {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 65rpx;
					height: 65rpx;
					margin-left: 5px;
					background: var(--emoji-bg);
					border-radius: 50rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: var(--emoji-icon-color);
					line-height: 28rpx;
				}
			}
		}

		.message-other {
			width: 100%;
			background: #F4F5F7;
			display: flex;
			align-items: flex-end;
			padding: 16rpx 30rpx;
			width: 100%;
			height: 200rpx;
			overflow: auto;
			position: fixed;
			background: #EDEDED;
			bottom: 0;

			.emoji-scroll-view {
				ul {
					padding: 8px;
					display: flex;
					flex-wrap: wrap;

					li {
						margin: 9px;
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;
						transition: all 0.2s ease 0s;

						img {
							width: 60rpx;
							height: 60rpx;
						}
					}

					li:hover {
						transform: scale(1.2);
					}
				}
			}
			
			.other-scroll-view {
				ul {
					padding: 8px;
					display: flex;
					flex-wrap: wrap;
				
					li {
						margin: 9px;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-wrap: wrap;
						cursor: pointer;
						transition: all 0.2s ease 0s;
						.u-icon {
							flex: 1;
							font-size: 100rpx;
							flex-basis: 100rpx;
							justify-content: center;
						}
						span {
							flex: 1;
							flex-basis: 100rpx;
							text-align: center;
						}
					}
				
					li:hover {
						transform: scale(1.2);
					}
				}
			}
		}
	}
</style>