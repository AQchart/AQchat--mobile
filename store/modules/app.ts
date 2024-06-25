import { defineStore } from 'pinia'
import User from '@/class/User'
import Msg from '@/class/Msg'
import AQSender from '@/common/sockets/AQSender'
import * as AQChatMSg from '@/common/sockets/protocol/AQChatMsgProtocol_pb'
import MsgStatusEnum from "@/enums/MsgStatusEnum"
import MsgTypeEnum from "@/enums/MsgTypeEnum"
import CustomSnowflake from "@/utils/CustomSnowflake"

interface RoomInfo {
	roomId : string,
	roomNo : string,
	roomName : string,
	ai: number| string
}


interface AppState {
	websocketStatus : boolean,
	socket : any,
	userInfo : User,
	themeDark : boolean,
	roomInfo : RoomInfo,
	// 消息列表
	msgList : Msg[],
	// 消息状态定时器
	msgStatusTimer : Object,
	// 房间成员
	memberList : User[],
	// 声音开启状态
	soundActive : boolean,
	// 声音dom
	soundDom : any,
	// 消息id，更新用于监听变化，判断是否需要消息触底
	msgId : number | string,
	// ai消息更新，判断是否需要触底
	aiCode : number | string,
	// 强制触底标识
	forceBottom : number | string,
}

const customSnowflake = new CustomSnowflake(1);

export const useAppStore = defineStore('app', {
	unistorage: {
		paths: ['theme', 'userInfo', 'roomInfo']
	}, // 是否持久化
	state: () : AppState => ({
		websocketStatus: false,
		socket: {
			status: false
		},
		userInfo: {
			userId: '',
			userName: '',
			userAvatar: ''
		},
		themeDark: false,
		roomInfo: {
			roomId: '',
			roomNo: '',
			roomName: '',
			ai: ''
		},
		msgList: [],
		msgStatusTimer: {},
		memberList: [],
		soundActive: false,
		soundDom: null,
		msgId: '',
		aiCode: '',
		forceBottom: ''
	}),
	getters: {
		theme: (state) => state.themeDark,
	},
	actions: {
		setMsgId(msgId : number | string) {
			this.msgId = msgId;
		},
		setAiCode(code : number | string) {
			this.aiCode = code;
		},
		setForceBottom(code : number | string) {
			this.forceBottom = code
		},
		setTheme(theme : boolean) {
			this.themeDark = theme
		},
		setUserInfo(userInfo : User) {
			this.userInfo = userInfo
		},
		resetRoomInfo() {
			this.roomInfo = {
				roomId: '',
				roomNo: '',
				roomName: ''
			}
			this.msgList = []
		},
		clearMsgStatusTimer(id : string) {
			if (this.msgStatusTimer[id]) {
				clearTimeout(this.msgStatusTimer[id]);
				delete this.msgStatusTimer[id]
			}
		},
		setWebsocketStatus(status : boolean) {
			this.websocketStatus = status
		},
		setSocketStatus(status : any) {
			this.socket.status = status
		},
		setRoomInfo(info : RoomInfo) {
			this.roomInfo = info
		},
		clearMessage() {
			this.msgList = []
		},
		setMsgRecord(msg : Msg) {
			if (!this.msgList.find(x => x.msgId == msg.msgId)?.msgId) {
				this.msgList.unshift(msg)
			}
		},
		pushMessage(msg : any) {
			this.msgList.push(msg)
		},
		// 同步房间消息
		asyncMessage(msgList : any[]) {
			this.msgList = msgList
		},
		resetAllInfo() {
			this.roomInfo = {
				roomId: '',
				roomNo: '',
				roomName: ''
			}
			this.userInfo = {
				userId: '',
				userName: '',
				userAvatar: ''
			}
			this.msgList = []
		},
		sendInfo(msg : string, msgType : MsgTypeEnum, ext : string = '') {
			const msgId = customSnowflake.nextId();
			const msgInfo : Msg = {
				user: {
					userId: this.userInfo.userId,
					userAvatar: this.userInfo.userAvatar,
					userName: this.userInfo.userName,
				},
				roomId: this.roomInfo.roomId,
				msgId: msgId,
				msgType: msgType,
				msg: msg,
				msgStatus: MsgStatusEnum.PENDING,
				ext: ext
			}
			this.sendInfoLocalFun(msgInfo)

			this.sendInfoNetWorkFun(msgInfo)
		},
		sendInfoLocalFun(msg : Msg) {
			this.msgList.push(msg)
			this.setMsgId(msg.msgId as never)
		},
		sendInfoNetWorkFun(msg : Msg) {
			let sendMsg = new AQChatMSg.default.SendMsgCmd();
			sendMsg.setMsgid(msg.msgId);
			sendMsg.setMsgtype(msg.msgType);
			sendMsg.setMsg(msg.msg)
			sendMsg.setRoomid(this.roomInfo.roomId);
			sendMsg.setExt(msg.ext);
			AQSender.getInstance().sendMsg(
				AQChatMSg.default.MsgCommand.SEND_MSG_CMD, sendMsg
			)
			// 10s消息未发送成功，则设置消息为发送失败状态
			this.msgStatusTimer[msg.msgId] = setTimeout(() => {
				msg.msgStatus = MsgStatusEnum.REJECTED
				for (let i = this.msgList.length - 1; i >= 0; i--) {
					if (this.msgList[i].msgId === msg.msgId) {
						const newMsg = { ...msg };
						newMsg.msgStatus = MsgStatusEnum.REJECTED;
						this.msgList.splice(i, 1, newMsg)
						break;
					}
				}
			}, 10000)
		},
		// 删除聊天室成员
		deleteNumberList(user : User) {
			this.memberList = this.memberList.filter((x : User) => x.userId != user.userId);
		},
		// 撤回聊天消息
		removeMsg(msgId : number | string, msg : any) {
			for (let i = this.msgList.length - 1; i >= 0; i--) {
				if (this.msgList[i].msgId == msgId) {
					this.msgList.splice(i, 1, msg)
					break;
				}
			}
		},
	}
})