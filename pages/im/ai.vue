<template>
	<view class="chat">
		<view style="height: 25px;">
			<top-bar></top-bar>
		</view>
		<scroll-view :style="{height: `${windowHeight-25}px`}" @scroll="scrollEvent" id="scrollview" scroll-y="true"
			:scroll-top="scrollTop" :scroll-with-animation="true" class="scroll-view">
			<!-- 聊天主体 -->
			<view id="msglistview" class="chat-body">
				<div class="ai-tip">
					<lottie class="icon-ai" :src="lottieAi" />
					<div class="txt">欢迎进入AI空间（AI Space），您可以直接发起连续提问，小T会回答您任何问题。</div>
					<div class="txt">如有其它需求，可以选择@其他AI助手。</div>
					<div class="ai-list">
						<div class="ai-item" v-for="item in aiInfoList" :key="item.userName">
							<img class="ai-avatar" :src="item.userAvatar" alt="">
							<div class="ai-desc">{{ item.desc }}</div>
						</div>
					</div>
				</div>
				<!-- 聊天记录 -->
				<render-msg v-for="msg in msgList" :key="msg.msgId" :message="msg" :currentUser="appStore.userInfo"
					@rewrite='rewriteFun'></render-msg>
			</view>
		</scroll-view>
		<!-- 底部消息发送栏 -->
		<!-- 用来占位，防止聊天消息被发送框遮挡 -->
		<view class="chat-bottom">
			<view v-if="showScroll" class="scroll-bottom">
				<u-icon name="arrow-downward" @click="scrollToBottom"></u-icon>
			</view>
			<view class="send-msg send-msg-only">
				<view>
					<imEditor ref="editorRef" placeholder="输入内容..." @input="onEditorInput" @focus="textareaFocus">
					</imEditor>
				</view>
				<view class="send-btn">
					<u-icon @click="showAt()" custom-prefix="custom-icon" name=" icon-aite" class="emoji"></u-icon>
					<button :disabled="appStore.editorDisabled" @click="sendTextMsg" v-if="showSend"
						class="send">发送</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import renderMsg from './components/render-msg.vue'
	import imEditor from './layout/editor.vue'
	import { ref, onMounted, computed, watch, nextTick } from 'vue'
	import { useAppStore } from '@/store/modules/app'
	import useChart from './hook/useChat'
	import emoList from './hook/emo'
	import lottie from "../components/lottie.vue";
	import { OssHelper } from '@/common/sockets/utils/OssHelper'
	import CustomSnowflake from "@/utils/CustomSnowflake"
	import * as AQChatMSg from '@/common/sockets/protocol/AQChatMsgProtocol_pb';
	import AQSender from '@/common/sockets/AQSender'
	import MsgTypeEnum from "@/enums/MsgTypeEnum"
	import MsgStatusEnum from "@/enums/MsgStatusEnum"
	import lottieAi from '/static/assets/json/lottie-ai.json';
	import Msg from "@/class/Msg"
	import topBar from './layout/top-bar.vue'
	import { AssistantsList, AiWaitMsgInfo } from "@/common/config"
	const appStore = useAppStore()
	const customSnowflake = new CustomSnowflake();
	const {
		RecoverUserFun,
		asyncRoomMessageFun
	} = useChart()

	const aiInfoList = AssistantsList
	const scrollTop = ref(999999)
	// 新消息条数
	const newMsgCount = ref(0);
	const plusShow = ref(false)
	const emojiShow = ref(false)
	const editorRef = ref()
	const msgStr = ref('')
	const showScroll = ref(false)
	const currentScroll = ref(0)

	let msgList : any = appStore.msgList

	onMounted(() => {
		// 恢复房间进入时消息同步
		if (appStore.websocketStatus) {
			syncChatRecordFun();
		}
	})
	const textareaFocus = () => {

	}
	const onEditorInput = (html : any) => {
		msgStr.value = html
	}
	// 发送消息同步指令
	const syncChatRecordFun = () => {
		let syncChatRecord = new AQChatMSg.default.SyncChatRecordCmd();
		syncChatRecord.setRoomid(appStore.roomInfo.roomId);
		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.SYNC_CHAT_RECORD_CMD, syncChatRecord
		)
	}
	// 显示艾特框
	const showAt = () => {
		editorRef.value && editorRef.value.showAt()
	}

	// 重新编辑
	const rewriteFun = (ext : any) => {
		editorRef.value && editorRef.value.rewriteFun(ext)
	}

	watch(appStore.msgList, (newV) => {
		msgList.value = newV;
	}, { deep: true })

	// 监听msgId变化，判断是否需要触底
	watch(() => appStore.msgId, (newV) => {
		scrollToBottom()
	})

	watch(() => appStore.aiCode, (newVal) => {
		scrollToBottom()
	})

	// 监听websocket状态
	watch(appStore.socket, (newV) => {
		if (newV.status) {
			setTimeout(() => {
				syncChatRecordFun();
			}, 500)
		} else {
			RecoverUser()
		}
	})

	const showSend = computed(() => {
		return msgStr.value.length > 0
	})

	const windowHeight = computed(() => {
		let px = uni.getSystemInfoSync().windowHeight;
		if (emojiShow.value || plusShow.value) {
			px = px - 162
		}
		else {
			px = px - 62
		}
		return px
	})

	const scrollEvent = (e : any) => {
		currentScroll.value = e.detail.scrollHeight
		showScroll.value = e.detail.scrollHeight - e.detail.scrollTop >= 1000
	}

	// 滚动至聊天底部
	const scrollToBottom = () => {
		if (currentScroll.value == 0) {
			scrollTop.value = currentScroll.value - 100
			nextTick(() => {
				let query = uni.createSelectorQuery().in(this);
				query.select('#scrollview').boundingClientRect();
				query.select('#msglistview').boundingClientRect();
				query.exec((res) => {
					const height1 = res[1].height
					const height0 = res[0].height
					scrollTop.value = height1 > height0 ? height1 : height0;
				})
			})
		} else {
			scrollTop.value = currentScroll.value - 100
			nextTick(() => {
				scrollTop.value = currentScroll.value
			})
		}
	}

	// 监听强制触底标识
	watch(() => appStore.forceBottom, (newV) => {
		newMsgCount.value = 0;
		scrollToBottom()
	})

	// 恢复用户信息
	function RecoverUser() {
		uni.showModal({
			title: '提示',
			content: '长时间未活动，服务器已断开连接，是否恢复连接',
			cancelText: '是',
			confirmText: '否',
			success(res) {
				if (res.confirm) {
					RecoverUserFun()
				} else {
					appStore.clearAll()
					uni.navigateTo({
						url: '/pages/index/index'
					})
				}
			},
			fail() {
				appStore.clearAll()
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		})
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
		if (appStore.editorDisabled) {
			uni.showToast({
				icon: 'none',
				title: '正在生成中..'
			})
			return
		}
		// let ext = editorRef.value.getAtList() + editorRef.value.getText()
		sendMessage(msgStr.value, editorRef.value.getAtList(), editorRef.value.getCallUserList())
	}


	// 组装和发送消息
	const sendMessage = (msg : string, ext : string, callUserList : []) => {
		// const data = {
		// 	roomId: appStore.roomInfo.roomId,
		// 	msgType: type,
		// 	msg: msg,
		// 	msgId: snowFake.nextId()
		// }
		// sendMessageFun(data)
		if(ext && ext != '') {
			let text = editorRef.value.getText()
			ext += `&${text}`
		}
		appStore.sendInfo(msg, MsgTypeEnum.TEXT, ext, callUserList)
		msgStr.value = ''
		editorRef.value.clear()
	}



	onMounted(() => {
		uni.setNavigationBarTitle({
			title: `聊天房：${appStore.roomInfo.roomName}`
		})
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

			background-color: var(--im-content-bg2);

			.chat-body {
				display: flex;
				flex-direction: column;
				padding-top: 23rpx;

				.ai-tip {
					width: 90%;
					margin: 0 auto;
					padding: 20px 15px 15px 15px;
					border-radius: 10px;
					text-align: left;
					color: var(--txt-color);

					.ai-list {
						margin-top: 10px;

						.ai-item {
							display: flex;
							align-items: center;

							.ai-avatar {
								width: 45px;
								height: 45px;
								margin-right: 15px;
								border-radius: 50%;
							}
						}
					}

					.icon-ai {
						height: 100px !important;
						width: 100px !important;
						margin: 0 auto;
					}

					img {
						width: 60px;
						height: auto
					}

					.txt {
						font-weight: 400;
					}

					.txt,
					.txt2 {
						font-size: 16px;
						line-height: 26px;
					}
				}
			}
		}

		/* 底部聊天发送栏 */
		.chat-bottom {
			width: 100%;
			background: var(--input-out-bg);

			.scroll-bottom {
				position: absolute;
				z-index: 1400;
				width: 45px;
				height: 30px;
				right: -1px;
				bottom: 100px;
				// border-radius: 20px;
				background-color: #cfcfcf;
				border-top-left-radius: 50px;
				border-bottom-left-radius: 50px;

				.u-icon {
					margin-top: 5px;
					margin-left: 5px;
					width: 20px;
					height: 20px;
					color: var(--send-btn-color);
					font-size: 20px;
					border-radius: 50px;
					line-height: 20px;
					text-align: center;
					background-color: red;
				}
			}

			.send-msg-only {
				bottom: 0;
				::v-deep .im-container {
					width: 520rpx;
				}
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
				background: var(--chat-tab-bar-bg);
			}

			.send-btn {
				display: flex;
				flex: 0 0 auto;
				margin-left: 10rpx;
				height: 75rpx;

				.send {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 89rpx;
					height: 45rpx;
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
					border-radius: 50rpx;
					font-size: 36rpx;
					font-family: PingFang SC;
					font-weight: 500;
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
					padding: 20rpx;
					display: flex;
					flex-wrap: wrap;

					li {
						margin: 20rpx;
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
						padding: 8rpx;

						.content-view {
							width: 130rpx;
							height: 130rpx;
							text-align: center;

							.img-box {
								img {
									width: 80rpx;
									height: 80rpx;
								}

								text-align: center;
							}

							span {
								text-align: center;
							}
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