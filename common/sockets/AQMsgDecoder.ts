/*
 * @Author: zsdddz
 * @Date: 2024-04-21 00:53:16
 * @LastEditTime: 2024-04-21 21:16:04
 */
import * as AQChatMSg from './protocol/AQChatMsgProtocol_pb';

/**
 * 消息解码器
 */
export default class AQMsgDecoder {

    /**
     * 构建消息体
     * 
     * @param nMsgCode 消息编码
     * @param uint8Array 字节数组
     * @return 消息体
     */
    decode(msgCommand: number, uint8Array: Uint8Array): any {
        if (msgCommand < 0 || 
            null == uint8Array || 
            uint8Array.byteLength <= 0) {
            return null;
        }

        // 获取消息名称
        let strMsgName = this.getMessageName(msgCommand);
        if (null == strMsgName) {
            console.error(`消息名称为空, msgCommand = ${msgCommand}`);
            return null;
        }
        let tempArray = strMsgName.split("_");
        strMsgName = "";

        for (let strTemp of tempArray) {
            strMsgName += strTemp.charAt(0) + strTemp.substr(1).toLowerCase();
        }

        // 获取消息类
        let oMsgClazz = AQChatMSg.default[strMsgName];

        if (null == oMsgClazz || 
            "function" != typeof(oMsgClazz["deserializeBinary"])) {
                console.error(`未找到相关的消息类, msgCode = ${msgCommand}, msgName = ${strMsgName}`);
            return null;
        }

        return oMsgClazz.deserializeBinary(uint8Array);
    }

    getMessageName(value) {
        for (const key in AQChatMSg.default.MsgCommand) {
          if (AQChatMSg.default.MsgCommand[key] === value) {
            return key;
          }
        }
        return null; 
      }
}
