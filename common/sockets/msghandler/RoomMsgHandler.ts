/*
 * @Author: ghost
 */

import * as AQChatMSg from '../protocol/AQChatMsgProtocol_pb';
import AQSender from '../AQSender';
import UserLoginAckHandler from './UserLoginAckHandler'

// 加入房间ack处理器
class JoinRoomAckHandler {

	handle(msgAck : AQChatMSg.default.JoinRoomAck) {
		if (msgAck == null) {
			return;
		}
		return {
			roomId: msgAck.getRoomid(),
			roomNo: msgAck.getRoomno(),
			roomName: msgAck.getRoomname(),
		}
	}
}

// 创建房间ack处理器
class CreateRoomAckHandler {
	handle(msgAck : AQChatMSg.default.CreateRoomAck) {
		if (msgAck == null) {
			return;
		}
		return {
			roomId: msgAck.getRoomid(),
			roomNo: msgAck.getRoomno(),
			roomName: msgAck.getRoomname(),
		}
	}
}

// 加入房间通知处理器
class JoinRoomNotifyHandler {
	handle(msgAck : AQChatMSg.default.JoinRoomNotify) {
		if (msgAck == null) {
			return;
		}
		return {
			user: new UserLoginAckHandler().handle(msgAck.getUser()),
			roomId: msgAck.getRoomid(),
		}
	}
}

// 离开房间处理器

class LeaveRoomAckHandler {
	handle(msgAck : AQChatMSg.default.LeaveRoomAck) {
		if (msgAck == null) {
			return;
		}
		return {
			roomId: msgAck.getRoomid()
		}
	}
}

// 发送消息响应处理器
class SendMsgAckHandler {
	handle(msgAck : AQChatMSg.default.SendMsgAck) {
		if (msgAck == null) {
			return;
		}
		return {
			userId: msgAck.getUserid(),
			roomId: msgAck.getRoomid(),
			status: msgAck.getStatus(),
			msgId: msgAck.getMsgid()
		}
	}
}

// 收到广播消息处理器
class BroadcastMsgAckHandler {
	handle(msgAck : AQChatMSg.default.BroadcastMsgAck) {
		if (msgAck == null) {
			return;
		}
		return {
			user: new UserLoginAckHandler().handle(msgAck.getUser()),
			roomId: msgAck.getRoomid(),
			msgId: msgAck.getMsgid(),
			msgType: msgAck.getMsgtype(),
			msg: msgAck.getMsg()
		}
	}
}

// 收到同步消息处理器
class SyncChatRecordAckHandler {
	handle(msgAck : AQChatMSg.default.SyncChatRecordAck) {
		if (msgAck == null) {
			return;
		}
		const handler = new BroadcastMsgAckHandler()
		let r : AQChatMSg.default.ChatRecord[] = msgAck.getChatrecordsList()
		return {
			chatRecords: r.map(it => handler.handle(it) )
		}
	}
}

export {
	JoinRoomAckHandler,
	CreateRoomAckHandler,
	JoinRoomNotifyHandler,
	LeaveRoomAckHandler,
	SendMsgAckHandler,
	BroadcastMsgAckHandler,
	SyncChatRecordAckHandler
}