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
					<li @click="uploadImage">
						<u-icon name="photo"></u-icon>
						<span>图片</span>
					</li>
					<li @click="uploadVideo">
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
	import { ref, onMounted, computed, watch } from 'vue'
	import { useAppStore } from '../../store/modules/app'
	import useChart from './hook/useChat'
	import emoList from './hook/emo'
	import { OssHelper } from '../../common/sockets/utils/OssHelper'
	import AQChatMsgProtocol_pb, * as AQChatMSg from '../../common/sockets/protocol/AQChatMsgProtocol_pb';
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
		if (editorCtx.value != null) {
			editorCtx.value.insertImage(imgObject)
			editorCtx.value.getContents({
				success: (res: any) => {
					msgStr.value = res.html
				}
			})
		} else {
			uni.showToast({
				title: "选择表情失败",
				icon: 'none'
			})
		}
	}

	const onEditorInput = (e : any) => {
		if (e.detail.html == '<p><br></p>' && e.detail.text == '\n') {
			msgStr.value = ''
			return
		}
		msgStr.value = e.detail.html
	}

	// 上传图片
	const uploadImage = () => {
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: async function (res : any) {
				const result = await OssHelper.getInstance().uploadFile(res.tempFiles[0], AQChatMSg.default.MsgType.IMAGE)
				console.log(result)
				if (result && result.res.status == 200) {
					sendMessage(AQChatMSg.default.MsgType.IMAGE, result.url)
					scrollToBottom()
				}
			}
		});
	}

	// 上传视频
	const uploadVideo = () => {
		uni.chooseVideo({
			sourceType: ['camera', 'album'],
			success: async function (res : any) {
				const result = await OssHelper.getInstance().uploadFile(res.tempFile, AQChatMSg.default.MsgType.VIDEO)
				if (result && result.res.status == 200) {
					sendMessage(AQChatMSg.default.MsgType.VIDEO, result.url)
				}
			}
		});
	}

	const onEditorReady = () => {
		editorReadOny.value = false
		uni.createSelectorQuery().select('#editor').context((res : any) => {
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

	watch(appStore.msgQueue, () => {
		console.log("watch")
		scrollToBottom()
	})

	const showSend = computed(() => {
		return msgStr.value.length > 0
	})

	const rpxTopx = (px : number) => {
		return uni.upx2px(px)
	}

	const windowHeight = computed(() => {
		let px = uni.getSystemInfoSync().windowHeight;
		if (emojiShow.value || otherShow.value) {
			px = rpxTopx(px) - 90
		}
		else {
			px = rpxTopx(px) - 75
		}
		return px * 3.3
	})

	// 滚动至聊天底部
	const scrollToBottom = () => {
		setTimeout(() => {
			let query = uni.createSelectorQuery().in(this);
			query.select('#scrollview').boundingClientRect();
			query.select('#msglistview').boundingClientRect();
			query.exec((res) => {
				if (res[1].height > res[0].height) {
					scrollTop.value = (emojiShow.value || otherShow.value) ? rpxTopx(res[1].height) + 260 : rpxTopx(res[1].height) + 260 * 3
				}else {
					scrollTop.value = (emojiShow.value || otherShow.value) ? rpxTopx(res[0].height) + 260 : rpxTopx(res[0].height) + 260 * 3
				}
			})
		}, 50)
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
	}

	// 组装和发送消息
	const sendMessage = (type : number, msg : string) => {
		const data = {
			roomId: appStore.roomInfo.roomId,
			msgType: type,
			msg: msg
		}
		sendMessageFun(data)
		msgStr.value = ''
		editorCtx.value.clear({})
	}

	onMounted(() => {
		// 注册消息回调
		reciveMessageFun()
		uni.setNavigationBarTitle({
			title: appStore.roomInfo.roomName
		})
		console.log(msgList.value)
		setTimeout(() => {
			scrollToBottom()
			OssHelper.getInstance().init(AQChatMSg.default.MsgType.IMAGE, () => { })
		}, 500)
		setTimeout(() => {
			OssHelper.getInstance().init(AQChatMSg.default.MsgType.VIDEO, () => { })
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
					box-shadow: rgba(50, 50, 93, 0.1) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.1) 0px 18px 36px -18px inset;
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
						margin: 8px;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-wrap: wrap;
						cursor: pointer;
						transition: all 0.2s ease 0s;
						box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
						background-color: #fff;
						color: #000;
						border-radius: 20rpx;
						padding: 9rpx;

						.u-icon {
							flex: 1;
							font-size: 90rpx;
							flex-basis: 90rpx;
							justify-content: center;
						}

						span {
							flex: 1;
							flex-basis: 90rpx;
							text-align: center;
						}
					}

					li:hover {
						box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
					}
				}
			}
		}
	}
</style>