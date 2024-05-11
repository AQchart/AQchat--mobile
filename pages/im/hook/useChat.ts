import { ref, reactive, onMounted } from 'vue'
import multiavatar from "@multiavatar/multiavatar/esm"
import AQSender from '../../../common/sockets/AQSender'
import AQMsgHandlerFactory from '../../../common/sockets/msghandler/AQMsgHandlerFactory'
import AQChatMsgProtocol_pb, * as AQChatMSg from '../../../common/sockets/protocol/AQChatMsgProtocol_pb'
import CallbackMethodManager from '../../../common/sockets/CallbackMethodManager';
import { useAppStore } from '../../../store/modules/app'
import type * as uni from '@dcloudio/types';


export default () => {

	const appStore = useAppStore()


	const sendMessageAck = (res : any) => {
		if (!res) {
			uni.showToast({
				title: "发送消息失败！",
				icon: 'error'
			})
		}
	}

	const reciveMessageAck = (res : any) => {
		appStore.pushMessage(res)
	}

	// 发送消息
	const sendMessageFun = (msg : any) => {
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
		//注册获取回调函数
		CallbackMethodManager.registerCallback(AQChatMSg.default.MsgCommand.SEND_MSG_ACK, (res : any) => { sendMessageAck(res) });
		const message = new AQChatMSg.default.SendMsgCmd()
		message.setRoomid(msg.roomId)
		message.setMsgtype(msg.msgType)
		message.setMsg(msg.msg)
		message.setMsgid(msg.msgId)
		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.SEND_MSG_CMD,
			message
		);
	}

	const RecoverUserAck = (res : any) => {
		if (!res) {
			uni.showToast({
				title: '恢复失败！',
				icon: 'error'
			})
			uni.navigateTo({
				url: '/pages/index/index'
			})
		} else {
			uni.showToast({
				title: '恢复成功！',
				icon: 'success'
			})
			let message = new new AQChatMSg.default.SyncChatRecordCmd([appStore.roomInfo.roomId])
			asyncRoomMessageFun(message)
		}
	}

	// 恢复用户连接信息
	const RecoverUserFun = () => {
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
		//注册获取回调函数
		CallbackMethodManager.registerCallback(AQChatMSg.default.MsgCommand.RECOVER_USER_ACK, (res : any) => { RecoverUserAck(res) });

		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.RECOVER_USER_CMD,
			new AQChatMSg.default.CreateRoomCmd([appStore.userInfo.userId])
		);
	}

	// 接收消息回调
	const reciveMessageFun = () => {
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
		//注册获取回调函数
		CallbackMethodManager.registerCallback(AQChatMSg.default.MsgCommand.BROADCAST_MSG_ACK, (res : any) => { reciveMessageAck(res) });
	}
	
	// 同步消息回调
	const asyncChatRrcordAck = (res: any[]) => {
		appStore.asyncMessage(res)
	}

	// 同步消息
	const asyncRoomMessageFun = (message : AQChatMSg.default.SyncChatRecordCmd) => {
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
		//注册获取回调函数
		CallbackMethodManager.registerCallback(AQChatMSg.default.MsgCommand.SYNC_CHAT_RECORD_ACK, (res : any) => { asyncChatRrcordAck(res) });
		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.SYNC_CHAT_RECORD_CMD,
			message
		);
	}

	return {
		sendMessageFun,
		reciveMessageFun,
		asyncRoomMessageFun,
		RecoverUserFun
	}
}