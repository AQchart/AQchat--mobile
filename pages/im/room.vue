<template>
	<view class="chat">
		<scroll-view :style="{height: `${windowHeight}px`}" id="scrollview" scroll-y="true" :scroll-top="scrollTop"
			:scroll-with-animation="true" class="scroll-view">
			<!-- 聊天主体 -->
			<view id="msglistview" class="chat-body">
				<!-- 聊天记录 -->
				<render-msg v-for="msg in msgList" :key="msg.msgId" :message="msg" :currentUser="appStore.userInfo"
					@rewrite='rewriteFun'></render-msg>
			</view>
		</scroll-view>
		<!-- 底部消息发送栏 -->
		<!-- 用来占位，防止聊天消息被发送框遮挡 -->
		<view class="chat-bottom">
			<view class="send-msg" :class="(otherShow || emojiShow) ? 'send-msg-other': 'send-msg-only'">
				<view class="uni-textarea">
					<imEditor ref="editorRef" class="im-container" placeholder="输入内容..." @input="onEditorInput"
						@focus="textareaFocus">
					</imEditor>
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
	import imEditor from './layout/editor.vue'
	import { ref, onMounted, computed, watch } from 'vue'
	import { useAppStore } from '@/store/modules/app'
	import useChart from './hook/useChat'
	import emoList from './hook/emo'
	import { OssHelper } from '@/common/sockets/utils/OssHelper'
	import CustomSnowflake from "@/utils/CustomSnowflake"
	import * as AQChatMSg from '@/common/sockets/protocol/AQChatMsgProtocol_pb';
	import AQSender from '@/common/sockets/AQSender'
	import MsgTypeEnum from "@/enums/MsgTypeEnum"
	import MsgStatusEnum from "@/enums/MsgStatusEnum"
	import Msg from "@/class/Msg"

	const appStore = useAppStore()
	const epoch = +new Date();
	const customSnowflake = new CustomSnowflake(1, epoch);
	const {
		RecoverUserFun,
		asyncRoomMessageFun
	} = useChart()


	const scrollTop = ref(999999)
	// 新消息条数
	const newMsgCount = ref(0);
	const otherShow = ref(false)
	const emojiShow = ref(false)
	const editorRef = ref(null)
	const msgStr = ref('')

	let msgList : any = appStore.msgList

	onMounted(() => {
		// 恢复房间进入时消息同步
		if(appStore.websocketStatus){
			syncChatRecordFun();
		}
	})

	const showOther = () => {
		otherShow.value = !otherShow.value
		if (otherShow.value) {
			emojiShow.value = false
		}
	}
	const textareaFocus = () => {
		otherShow.value = false;
		emojiShow.value = false;
	}
	const selectIcon = (icon : any) => {
		let imgObject = {
			src: icon.icon,
			alt: icon.title,
		}
		if (editorRef.value != null) {
			editorRef.value.insertImage(imgObject)
		} else {
			uni.showToast({
				title: "选择表情失败",
				icon: 'none'
			})
		}
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
	// 上传图片
	const uploadImage = () => {
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: async function (res : any) {
				const msgId = customSnowflake.nextId();
				let msgInfo : Msg = {
					user: {
						userId: appStore.userInfo.userId,
						userAvatar: appStore.userInfo.userAvatar,
						userName: appStore.userInfo.userName,
					},
					roomId: appStore.roomInfo.roomId,
					msgId: msgId,
					msgType: MsgTypeEnum.IMAGE,
					msg: res.tempFilePaths[0],
					msgStatus: MsgStatusEnum.PENDING,
					ext: res.tempFiles[0].name
				}
				appStore.sendInfoLocalFun(msgInfo)
				uploadToOss(msgInfo, res.tempFiles[0])
			}
		});
	}
	// 上传文件到服务器
	const uploadToOss = (msgInfo : Msg, file : File) => {
		OssHelper.getInstance().init(msgInfo.msgType, () => {
			OssHelper.getInstance().uploadFile(file)
				.then((res) => {
					msgInfo.msg = res.url;
					// 上传到Oss成功后再将文件发送到真实网络中
					appStore.sendInfoNetWorkFun(msgInfo)
				}).catch((err) => {
					ElMessage.error("上传失败,错误为:" + err)
				});
		});
	}
	// 上传视频
	const uploadVideo = () => {
		uni.chooseVideo({
			sourceType: ['camera', 'album'],
			success: async function (res : any) {
				console.log(res);
				const msgId = customSnowflake.nextId();
				let msgInfo : Msg = {
					user: {
						userId: appStore.userInfo.userId,
						userAvatar: appStore.userInfo.userAvatar,
						userName: appStore.userInfo.userName,
					},
					roomId: appStore.roomInfo.roomId,
					msgId: msgId,
					msgType: MsgTypeEnum.VIDEO,
					msg: res.tempFilePath,
					msgStatus: MsgStatusEnum.PENDING,
					ext: res.name
				}
				appStore.sendInfoLocalFun(msgInfo)
				uploadToOss(msgInfo, res.tempFile)
			}
		});
	}
	// 表情包
	const showEmoji = () => {
		emojiShow.value = !emojiShow.value
		if (emojiShow.value) {
			otherShow.value = false
		}
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
		console.log("消息更新");
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
		if (emojiShow.value || otherShow.value) {
			px = px - 162
		}
		else {
			px = px - 62
		}
		return px
	})

	// 滚动至聊天底部
	const scrollToBottom = () => {
		setTimeout(() => {
			let query = uni.createSelectorQuery().in(this);
			query.select('#scrollview').boundingClientRect();
			query.select('#msglistview').boundingClientRect();
			query.exec((res) => {
				const height1 = res[1].height
				const height0 = res[0].height
				scrollTop.value = height1 > height0 ? height1 : height0;
			})
		}, 50)
	}

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
		sendMessage(0, msgStr.value)
	}

	// 组装和发送消息
	const sendMessage = (type : number, msg : string) => {
		// const data = {
		// 	roomId: appStore.roomInfo.roomId,
		// 	msgType: type,
		// 	msg: msg,
		// 	msgId: snowFake.nextId()
		// }
		// sendMessageFun(data)
		appStore.sendInfo(msg, MsgTypeEnum.TEXT)
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
				background: #fff;
			}

			.uni-textarea {
				.im-container {
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
				margin-left: 10rpx;
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