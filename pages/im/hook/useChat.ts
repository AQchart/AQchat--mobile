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
	
	
	const sendMessageAck = (res: any) => {
		console.log(res)
		if(!res) {
			uni.showToast({
				title: "发送消息失败！",
				icon: 'error'
			})
		}
	}
	
	const reciveMessageAck = (res: any) => {
		console.log(res)
		appStore.pushMessage(res)
	}

	// 发送消息
	const sendMessageFun = (msg: any) => {
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
		CallbackMethodManager.registerCallback(AQChatMSg.default.MsgCommand.SEND_MSG_ACK, (res: any) => { sendMessageAck(res) });
		const message = new AQChatMSg.default.SendMsgCmd()
		message.setRoomid(msg.roomId)
		message.setMsgtype(msg.msgType)
		message.setMsg(msg.msg)
		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.SEND_MSG_CMD,
			message
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
		//注册获取sts回调函数
		CallbackMethodManager.registerCallback(AQChatMSg.default.MsgCommand.BROADCAST_MSG_ACK, (res: any) => { reciveMessageAck(res) });
	}

	return {
		sendMessageFun,
		reciveMessageFun
	}
}