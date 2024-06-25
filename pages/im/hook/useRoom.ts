import { ref, reactive, onMounted } from 'vue'
import multiavatar from "@multiavatar/multiavatar/esm"
import AQSender from '../../../common/sockets/AQSender'
import AQMsgHandlerFactory from '../../../common/sockets/msghandler/AQMsgHandlerFactory'
import AQChatMsgProtocol_pb, * as AQChatMSg from '../../../common/sockets/protocol/AQChatMsgProtocol_pb'
import CallbackMethodManager from '../../../common/sockets/CallbackMethodManager';
import { useAppStore } from '../../../store/modules/app'
import type * as uni from '@dcloudio/types';


export default () => {

	interface RoomForm {
		roomNo : number,
		roomName : string,
		history : number,
		ai : number
	}
	const roomForm = reactive<RoomForm>({
		roomNo: 0,
		roomName: '',
		history: 1,
		ai: 0
	})
	const reloadLoading = ref(true)

	const appStore = useAppStore()

	const joinRoomAck = (res : any) => {
		uni.showToast({
			title: res ? "加入成功" : "加入失败",
			icon: res ? 'success' : 'error',
			duration: 2300
		})
		if (res) intoRoom(res)
	}

	const intoRoom = (res : any) => {
		appStore.setRoomInfo(res)
		uni.navigateTo({ url: "/pages/im/room" })
	}

	const createRoomAck = (res : any) => {
		uni.showToast({
			title: res ? "创建成功" : "创建失败",
			icon: res ? 'success' : 'error',
			duration: 2300
		})
		if (res) intoRoom(res)
	}

	// 加入房间
	const joinRoomFun = () => {
		if (!appStore.websocketStatus) {
			uni.showToast({
				title: "服务器连接异常！",
				icon: 'error'
			})
		}
		const message = new AQChatMSg.default.JoinRoomCmd()
		message.setRoomno(roomForm.roomNo)
		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.JOIN_ROOM_CMD,
			message
		);
	}

	// 创建房间
	const createRoomFun = () => {
		if (!appStore.websocketStatus) {
			uni.showToast({
				title: "服务器连接异常！",
				icon: 'error'
			})
		}
		let message = new AQChatMSg.default.CreateRoomCmd();
		message.setRoomno(roomForm.roomNo);
		message.setRoomname(roomForm.roomName.trim());
		message.setHistory(roomForm.history);
		message.setAi(roomForm.ai);
		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.CREATE_ROOM_CMD,
			message
		);
	}

	// 离开房间
	const leaveRoomFun = () => {
		uni.showModal({
			title: '提示',
			content: '确定离开当前房间？',
			success: function (res : any) {
				if (res.confirm) {
					let model = new AQChatMSg.default.LeaveRoomCmd();
					model.setRoomid(appStore.roomInfo.roomId);
					AQSender.getInstance().sendMsg(AQChatMSg.default.MsgCommand.LEAVE_ROOM_CMD, model)
					setTimeout(() => {
						appStore.resetRoomInfo();
						uni.navigateTo({
							url: '/pages/im/index'
						});
					}, 100)
				}
			}
		});
	}

	const sentences = ['天涯何处觅知音！别忘了回来。', '大爷记得回来玩！', '有空再聊，再见！', '常联系，Bye~', 'see you next time']

	const RandomText = () => {
		return sentences[Math.trunc(sentences.length * Math.random())]
	}

	const logoutFun = () => {
		uni.showModal({
			title: '提示',
			content: RandomText(),
			success: function (res : any) {
				if (res.confirm) {
					let userLogout = new AQChatMSg.default.UserLogoutCmd();
					userLogout.setUserid(appStore.userInfo.userId);

					AQSender.getInstance().sendMsg(
						AQChatMSg.default.MsgCommand.USER_LOGOUT_CMD, userLogout
					)
					setTimeout(() => {
						appStore.resetAllInfo();
						AQSender.getInstance().heartbeatStop();
						uni.navigateTo({
							url: '/pages/index/index'
						});
					}, 100)
				}
			}
		});
	}

	return {
		roomForm,
		reloadLoading,
		joinRoomFun,
		createRoomFun,
		leaveRoomFun,
		logoutFun
	}
}