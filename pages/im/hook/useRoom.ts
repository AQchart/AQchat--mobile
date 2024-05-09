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
		roomName : string
	}
	const roomForm = reactive<RoomForm>({
		roomNo: 0,
		roomName: ''
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

	const intoRoom = (res) => {
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

		let handlerFactory = AQMsgHandlerFactory.getInstance();
		//重写onMsgReceived方法
		AQSender.getInstance().onMsgReceived = (msgCommand, msgBody) => {
			let data = handlerFactory.handle(msgCommand, msgBody);
			//获取回调函数
			let callbackMethod = CallbackMethodManager.getCallback(msgCommand);
			//执行回调函数
			if (callbackMethod) {
				callbackMethod(data);
			}
		}
		//注册获取sts回调函数
		CallbackMethodManager.registerCallback(AQChatMSg.default.MsgCommand.JOIN_ROOM_ACK, (res: any) => { joinRoomAck(res) });
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

		let handlerFactory = AQMsgHandlerFactory.getInstance();
		//重写onMsgReceived方法
		AQSender.getInstance().onMsgReceived = (msgCommand, msgBody) => {
			let data = handlerFactory.handle(msgCommand, msgBody);
			//获取回调函数
			let callbackMethod = CallbackMethodManager.getCallback(msgCommand);
			//执行回调函数
			if (callbackMethod) {
				callbackMethod(data);
			}
		}
		//注册获取sts回调函数
		CallbackMethodManager.registerCallback(AQChatMSg.default.MsgCommand.CREATE_ROOM_ACK, (res) => { createRoomAck(res) });

		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.CREATE_ROOM_CMD,
			new AQChatMSg.default.CreateRoomCmd([roomForm.roomNo, roomForm.roomName])
		);
	}

	return {
		roomForm,
		reloadLoading,
		joinRoomFun,
		createRoomFun
	}
}