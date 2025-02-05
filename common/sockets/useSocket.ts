import AQSender from './AQSender'
import AQMsgHandlerFactory from './msghandler/AQMsgHandlerFactory'
import * as AQChatMSg from './protocol/AQChatMsgProtocol_pb'
import { useAppStore } from "../../store/modules/app"
import ExceptionEnum from "@/enums/ExceptionEnum"
import Msg from "@/class/Msg"
import MsgTypeEnum from "@/enums/MsgTypeEnum"
import MsgStatusEnum from "@/enums/MsgStatusEnum"
import AiTypeEnum from "@/enums/AiTypeEnum"
import { AiWaitMsgInfo } from "@/common/config"
import CallbackMethodManager from '@/common/sockets/CallbackMethodManager';
import { ref, watch } from 'vue'

export default () => {
	const appStore = useAppStore()
	const showTip = ref(false)
	// 获取页面路径
	const getPageFun = () => {
		// 获取当前页面栈数组
		const pages = getCurrentPages();
		// 获取数组中最后一个元素，即当前页面的实例
		const currentPage = pages[pages.length - 1];
		// 获取当前页面的路由路径
		const route = currentPage.route;
		return route;
	}
	// 初始化websocket
	const initSocketFun = () : void => {
		const route = getPageFun();
		if (route?.indexOf('im') != -1 && appStore.userInfo.userId) {
			uni.showLoading({
				title: '恢复用户登录...'
			})
		} else {
			uni.hideLoading();
		}
		AQSender.getInstance().connect(() => {
			console.log("连接成功...");
			appStore.setWebsocketStatus(true);
			appStore.setSocketStatus(true);
			if (appStore.userInfo?.userId) {
				if (route?.indexOf('im') != -1) {
					const { userId, userName, userAvatar } = appStore.userInfo
					const msgArray = [userId, userName, userAvatar]
					if (appStore.roomInfo?.roomId) {
						msgArray.push(appStore.roomInfo.roomId)
					}
					AQSender.getInstance().sendMsg(
						AQChatMSg.default.MsgCommand.RECOVER_USER_CMD,
						new AQChatMSg.default.RecoverUserCmd(msgArray)
					)
				}
			}
			let handlerFactory = AQMsgHandlerFactory.getInstance();
			AQSender.getInstance().onMsgReceived = (msgCommand, msgBody) => {
				const result = handlerFactory.handle(msgCommand, msgBody);
				switch (msgCommand) {
					// 登录回调
					case AQChatMSg.default.MsgCommand.USER_LOGIN_ACK:
						loginFun(result);
						break;
					// 创建房间回调
					case AQChatMSg.default.MsgCommand.CREATE_ROOM_ACK:
						uni.navigateTo({
							url: "/pages/im/room"
						})
						appStore.setRoomInfo(result);
						if (result.ai === 1) {
							initAiFun()
						}
						break;
					// 加入房间回调
					case AQChatMSg.default.MsgCommand.JOIN_ROOM_ACK:
						uni.navigateTo({
							url: "/pages/im/room"
						})
						appStore.setRoomInfo(result);
						if (result.ai === 1) {
							initAiFun()
						}
						break;
					// 恢复用户连接
					case AQChatMSg.default.MsgCommand.RECOVER_USER_ACK:
						recoverUserFun(result);
						break;
					// 加入房间通知
					case AQChatMSg.default.MsgCommand.JOIN_ROOM_NOTIFY:
						joinRoomNotifyFun(result);
						break;
					// 接收广播消息
					case AQChatMSg.default.MsgCommand.BROADCAST_MSG_ACK:
						broadcastMsgFun(result);
						break;
					// 用户退出登录
					case AQChatMSg.default.MsgCommand.USER_LOGOUT_ACK:
						userLogoutFun(result);
						break;
					// 消息同步
					case AQChatMSg.default.MsgCommand.SYNC_CHAT_RECORD_ACK:
						syncChatRecordFun(result);
						break;
					// 同步房间成员
					case AQChatMSg.default.MsgCommand.SYNC_ROOM_MEMBERS_ACK:
						syncRoomMembersFun(result);
						break;
					// 消息发送状态
					case AQChatMSg.default.MsgCommand.SEND_MSG_ACK:
						sendMsgStatusFun(result);
						break;
					case AQChatMSg.default.MsgCommand.GET_STS_ACK:
						uploadFileFun(msgCommand, result)
						break;
					// 房间成员离线
					case AQChatMSg.default.MsgCommand.OFFLINE_NOTIFY:
						offlineNotyfyFun(result)
						break;
					// 当前用户离线
					case AQChatMSg.default.MsgCommand.OFFLINE_MSG:
						userOfflineFun(result)
						break;
					// 离线通知
					case AQChatMSg.default.MsgCommand.LEAVE_ROOM_NOTIFY:
						leaveRoomNotufyFun(result)
						break;
					// 消息撤回
					case AQChatMSg.default.MsgCommand.RECALL_MSG_ACK:
						recallMsgFun(result)
						break;
					// 消息撤回通知
					case AQChatMSg.default.MsgCommand.RECALL_MSG_NOTIFY:
						recallMsgNotifyFun(result)
						break;
					// 流消息
					case AQChatMSg.default.MsgCommand.STREAM_MSG_NOTIFY:
						streamMsgNotifyFun(result)
						break;
					// 开启AI空间回调
					case AQChatMSg.default.MsgCommand.OPEN_AI_ROOM_ACK:
						openAiRoomFun(result)
						break;
					// AI消息回调
					case AQChatMSg.default.MsgCommand.AI_REPLY_MSG_ACK:
						aiReplyMsg(result)
						break;
					// 异常消息回调
					case AQChatMSg.default.MsgCommand.EXCEPTION_MSG:
						exceptionFun(result);
						break;
				}
			}
		})
		AQSender.getInstance().closeService = () => {
			if (route?.indexOf('im') != -1) {
				uni.showModal({
					title: '系统提示',
					content: '服务已关闭，是否重新登录',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							uni.redirectTo({
								url: '/pages/index/index'
							});
							appStore.resetAllInfo();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
	// 消息撤回
	const recallMsgFun = (result : any) => {
		console.log("消息撤回", result);
		if (result.status) {
			const curMsg = appStore.msgList.find(x => x.msgId == result.msgId)
			const msg : Msg = {
				roomId: result.roomId,
				msgType: MsgTypeEnum.TIP,
				msg: '你撤回了一条消息',
				ext: curMsg?.msgType === MsgTypeEnum.TEXT ? curMsg?.msg : undefined
			}
			appStore.removeMsg(result.msgId, msg);
		} else {
			uni.showToast({
				title: "消息撤回失败，请稍后再试",
				icon: 'error'
			})
		}
	}
	// 消息撤回通知
	const recallMsgNotifyFun = (result : any) => {
		console.log("消息撤回通知", result);
		if (result.userId != appStore.userInfo.userId) {
			const user = appStore.memberList.find(x => x.userId == result.userId);
			const name = user?.userName || '成员'
			const msg : Msg = {
				roomId: result.roomId,
				msgType: MsgTypeEnum.TIP,
				msg: `${name}撤回了一条消息`
			}
			appStore.removeMsg(result.msgId, msg);
		}
	}

	// ai流消息
	const streamMsgNotifyFun = (result : any) => {
		if (appStore.roomInfo.ai == AiTypeEnum.AIZOOM) {
			let currentMsg = appStore.msgList.find(x => x.msgId === AiWaitMsgInfo.msgId);
			if (currentMsg) {
				if (currentMsg.msg === AiWaitMsgInfo.msg) {
					currentMsg.msgType = MsgTypeEnum.TEXT;
					currentMsg.msg = result.msg
					currentMsg.msgId = result.msgId
				} else {
					currentMsg.msg += result.msg
					appStore.setAiCode(+new Date() + '')
				}
			} else {
				currentMsg = appStore.msgList.find(x => x.msgId === result.msgId);
				if (!currentMsg) return
				currentMsg.msg += result.msg
				appStore.setAiCode(+new Date() + '')
			}
			if (result.streamType == 0) {
				appStore.setEditorDisabled(true)
			} else {
				appStore.setEditorDisabled(false)
			}
		} else {
			let currentMsg = appStore.msgList.find(x => x.msgId === result.msgId);
			if (currentMsg) {
				currentMsg.msg += result.msg
				appStore.setAiCode(+new Date() + '')
			} else {
				const msg : Msg = {
					user: {
						userId: result.userId,
						userAvatar: result.userAvatar,
						userName: result.userName,
					},
					roomId: result.roomId,
					msgType: MsgTypeEnum.TEXT,
					msg: result.msg,
					msgId: result.msgId
				}
				appStore.sendInfoLocalFun(msg)
				appStore.setMsgId(result.msgId)
			}
		}
	}


	// 房间成员离线
	const offlineNotyfyFun = (result : any) => {
		console.log("房间成员离线", result);
		if (appStore.roomInfo.roomId === result.roomId) {
			const msg : Msg = {
				roomId: result.roomId,
				msgType: MsgTypeEnum.TIP,
				msg: `${result.user.userName} 已离线`
			}
			appStore.sendInfoLocalFun(msg)
			appStore.setMsgId(result.msgId)
			appStore.deleteNumberList(result.user)
		}
	}
	// 房间成员同步
	const syncRoomMembersFun = (result : any) => {
		appStore.memberList = result;
	}
	// 当前用户离线
	const userOfflineFun = (result : any) => {
		console.log("当前用户离线", result);
		if (result.userId === appStore.userInfo.userId) {
			if (showTip.value) return;
			showTip.value = true;

			uni.showModal({
				title: '系统提示',
				content: '检测到您长时间置于后台，可能会影响消息实时性',
				confirmText: '刷新试试',
				cancelText: '不管',
				success: (res) => {
					if (res.confirm) {
						showTip.value = false;
						// #ifdef H5
						window.location.reload()
						// #endif
						// #ifndef H5
						reloadPage();
						// #endif
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
	}
	// 刷新页面
	const reloadPage = () => {
		uni.navigateBack({
			delta: 1,
			success: () => {
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 100);
			}
		});
	}
	// 离开房间
	const leaveRoomNotufyFun = (result : any) => {
		console.log("离开房间", result);
		if (appStore.roomInfo.roomId === result.roomId) {
			const msg : Msg = {
				roomId: result.roomId,
				msgType: MsgTypeEnum.TIP,
				msg: `${result.user.userName} 离开了房间`
			}
			appStore.sendInfoLocalFun(msg)
			appStore.setMsgId(result.msgId)
			appStore.deleteNumberList(result.user)
		}
	}
	// 上传文件
	const uploadFileFun = (msgCommand : number, file : File) => {
		let callbackMethod = CallbackMethodManager.getCallback(msgCommand);
		//执行回调函数
		if (callbackMethod) {
			callbackMethod(file);
			CallbackMethodManager.getCallback(10100)();
		}
	}
	// 消息发送状态修改
	const sendMsgStatusFun = (result : any) => {
		console.log("消息发送状态修改", result);
		for (let i = appStore.msgList.length - 1; i >= 0; i--) {
			if (appStore.msgList[i].msgId == result.msgId) {
				appStore.msgList[i].msgStatus = MsgStatusEnum.FULFILLED;
				appStore.clearMsgStatusTimer(result.msgId)
			}
		}
	}
	// 消息同步
	const syncChatRecordFun = (result : any) => {
		console.log("消息同步", result);
		for (let i = 0; i < result.length; i++) {
			const msg : Msg = result[i]
			appStore.setMsgRecord(msg)
		}
		if (appStore.roomType == 0) {
			initAiFun()
		}
	}
	// 用户退出登录
	const userLogoutFun = (result : any) => {
		if (result?.userId === appStore.userInfo.userId) {
			appStore.resetAllInfo();
			uni.redirectTo({
				url: '/pages/index/index',
			})
		}
	}

	// 发送ai提示
	const initAiFun = () => {
		const msg : Msg = {
			roomId: appStore.roomInfo.roomId,
			msgId: +new Date() + '',
			msgType: MsgTypeEnum.TEXT,
			msg: `你好，我是小Q，遇到不懂的问题，可以尝试在输入框<span style='color:var(--im-primary)'>@小Q</span>，我会随时替你解答！`,
			user: {
				userId: 'AQChatHelper',
				userAvatar: 'https://aqchat.oss-cn-shenzhen.aliyuncs.com/avatar/AQChatAI.png',
				userName: '小Q',
			},
		}
		appStore.sendInfoLocalFun(msg)
	}

	// 接收广播消息
	const broadcastMsgFun = (result : any) => {
		// console.log("接收广播消息",result);
		if (result.userId === appStore.userInfo.userId) return;
		const msg : Msg = {
			user: {
				userId: result.userId,
				userAvatar: result.userAvatar,
				userName: result.userName,
			},
			roomId: result.roomId,
			msgType: result.msgType,
			msg: result.msg,
			msgId: result.msgId,
			ext: result.ext
		}
		appStore.sendInfoLocalFun(msg)
		appStore.setMsgId(result.msgId)
		if (appStore.soundActive) {
			appStore.soundDom && appStore.soundDom.play();
		}
	}
	// 其他人加入房间通知
	const joinRoomNotifyFun = (result : any) => {
		// console.log('其他人加入房间通知',result);
		if (appStore.roomInfo.roomId === result.roomId) {
			if (!(result?.user?.userId)) return;
			const msgContent = result.user.userId === appStore.userInfo.userId ? '您' : result.user.userName;
			const msg : Msg = {
				roomId: result.roomId,
				msgId: +new Date(),
				msgType: MsgTypeEnum.TIP,
				msg: `${msgContent} 加入了房间`
			}
			appStore.sendInfoLocalFun(msg)
			appStore.setMsgId(result.msgId)
			// 同步房间用户
			let model = new AQChatMSg.default.SyncRoomMembersCmd();
			model.setRoomid(result.roomId)
			AQSender.getInstance().sendMsg(
				AQChatMSg.default.MsgCommand.SYNC_ROOM_MEMBERS_CMD, model
			)
		}
	}
	// 恢复用户登录
	const recoverUserFun = (result : any) => {
		uni.hideLoading();
		appStore.setRoomInfo({
			roomId: result.roomId || '',
			roomNo: result.roomNo || '',
			roomName: result.roomName || '',
			ai: result.ai || 0,
		})
	}
	// 用户登录
	const loginFun = (result : any) => {
		appStore.setUserInfo(result)
		uni.navigateTo({ url: "/pages/im/index" })
	}
	// 开启AI空间回调
	const openAiRoomFun = (result : any) => {
		const roomInfo = {
			roomId: result.roomId,
			roomName: 'AI空间',
			roomNo: '1024',
			ai: AiTypeEnum.AIZOOM
		}
		appStore.setRoomInfo(roomInfo);
		appStore.memberList = result.assistantsList
	}

	// AI图片、音频消息回调
	const aiReplyMsg = (result : any) => {
		let currentMsg = appStore.msgList.find(x => x.msgId === AiWaitMsgInfo.msgId);
		if (currentMsg) {
			currentMsg.msgType = result.msgType;
			currentMsg.msg = result.msg
			currentMsg.msgId = result.msgId
			appStore.setAiCode(+new Date() + '')
			appStore.setEditorDisabled(false)
		}
	}

	// 消息异常
	const exceptionFun = (result : any) => {
		console.log("消息异常", result);
		uni.showToast({
			title: result.msg,
			icon: 'error'
		})
		if (result.code === ExceptionEnum.NO_LOGIN || result.code === ExceptionEnum.USER_QUIT || result.code === ExceptionEnum.USER_MISMATCH) {
			appStore.resetAllInfo();
			AQSender.getInstance().heartbeatStop();
			uni.navigateTo({
				url: "/pages/index/index"
			})
		}
	}


	return {
		initSocketFun
	}
}