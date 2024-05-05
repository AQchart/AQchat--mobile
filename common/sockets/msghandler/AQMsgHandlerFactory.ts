/*
 * @Author: zsdddz
 * @Date: 2024-04-22 22:36:37
 * @LastEditTime: 2024-04-22 22:59:53
 */

import * as AQChatMSg from '../protocol/AQChatMsgProtocol_pb';
import GetStsAckHandler from './GetStsAckHandler';
import UserLoginAckHandler from './UserLoginAckHandler';
import { CreateRoomAckHandler, JoinRoomAckHandler, JoinRoomNotifyHandler, SyncChatRecordAckHandler, BroadcastMsgAckHandler, SendMsgAckHandler } from './RoomMsgHandler'
import ErrorHandler from './ErrorHandler'

export default class AQMsgHandlerFactory {
    private static instance: AQMsgHandlerFactory = new AQMsgHandlerFactory()
    private readonly handlerMap: { [command: number]: any } = {};

    static getInstance(){
        return AQMsgHandlerFactory.instance;
    }

    private constructor() {
        let msgCommand = AQChatMSg.default.MsgCommand;
        this.handlerMap[msgCommand.USER_LOGIN_ACK] = new UserLoginAckHandler();
        this.handlerMap[msgCommand.GET_STS_ACK] = new GetStsAckHandler();
		this.handlerMap[msgCommand.CREATE_ROOM_ACK] = new CreateRoomAckHandler();
		this.handlerMap[msgCommand.JOIN_ROOM_ACK] = new JoinRoomAckHandler();
		this.handlerMap[msgCommand.JOIN_ROOM_NOTIFY] = new JoinRoomNotifyHandler();
		this.handlerMap[msgCommand.EXCEPTION_MSG] = new ErrorHandler();
		this.handlerMap[msgCommand.SEND_MSG_ACK] = new SendMsgAckHandler();
		this.handlerMap[msgCommand.BROADCAST_MSG_ACK] = new BroadcastMsgAckHandler();
		this.handlerMap[msgCommand.SYNC_CHAT_RECORD_ACK] = new SyncChatRecordAckHandler();
    }

    handle(msgCommand:number, msgBody: any) {
        if(msgCommand<0||null==msgBody){
            return;
        }

        let handler = this.handlerMap[msgCommand];
        if(null == handler){
            console.error(`未找到消息处理器,msgCommand=${msgCommand}`);
            return;
        }
        return handler.handle(msgBody);
    }
}