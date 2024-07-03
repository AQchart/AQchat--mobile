/*
 * @Author: howcode 1051495009@qq.com
 * @Date: 2024-07-01 11:44:16
 * @LastEditors: howcode 1051495009@qq.com
 * @LastEditTime: 2024-07-01 17:26:07
 * @Description: Ai相应处理器
 */
import * as AQChatMSg from '../protocol/AQChatMsgProtocol_pb';

export default class AiReplyMsgAckHandler {

    handle(msgAck: AQChatMSg.default.AiReplyMsgAck) {
        if(msgAck == null){
            return;
        }
        return {
            roomId:msgAck.getRoomid(),
            msg:msgAck.getMsg(),
            msgId:msgAck.getMsgid(),
            msgType:msgAck.getMsgtype(),
            userAvatar:msgAck.getUser()?.getUseravatar(),
            userId:msgAck.getUser()?.getUserid(),
            userName:msgAck.getUser()?.getUsername(),
            status:msgAck.getStatus()
        }
    }
}