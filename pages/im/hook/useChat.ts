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

		//注册获取回调函数
		// CallbackMethodManager.registerCallback(AQChatMSg.default.MsgCommand.RECOVER_USER_ACK, (res : any) => { RecoverUserAck(res) });

		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.RECOVER_USER_CMD,
			new AQChatMSg.default.CreateRoomCmd([appStore.userInfo.userId])
		);
	}

	// 同步消息
	const asyncRoomMessageFun = (message : AQChatMSg.default.SyncChatRecordCmd) => {
		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.SYNC_CHAT_RECORD_CMD,
			message
		);
		appStore.setForceBottom(+new Date())
	}

	return {
		asyncRoomMessageFun,
		RecoverUserFun
	}
}