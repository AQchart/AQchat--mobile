/*
 * @Author: howcode 1051495009@qq.com
 * @Date: 2024-07-01 10:05:49
 * @LastEditors: howcode 1051495009@qq.com
 * @LastEditTime: 2024-07-01 10:18:45
 * @Description: 开启Ai空间消息处理器
 */
import * as AQChatMSg from '../protocol/AQChatMsgProtocol_pb';

export default class OpenAiRoomAckHandler {

    handle(msgAck: AQChatMSg.default.OpenAiRoomAck) {
        if(msgAck == null){
            return;
        }
        const result:AQChatMSg.default.Assistant[] = msgAck.getAssistantsList()
        let list:Array<any> = [];
        result.forEach(x=>{
           let item = {
            userId:x.getUserid(),
            userName:x.getName(),
            userAvatar:x.getAvatar(),
           }
           list.push(item)
        })
        return {
            roomId:msgAck.getRoomid(),
            assistantsList:list
        }
    }
}