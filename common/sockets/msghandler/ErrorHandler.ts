/*
 * @Author: zsdddz
 * @Date: 2024-04-22 22:46:30
 * @LastEditTime: 2024-04-24 16:54:23
 */

import * as AQChatMSg from '../protocol/AQChatMsgProtocol_pb';
import AQSender from '../AQSender';
import type * as uni from '@dcloudio/types';

export default class ErrorHandler {

    handle(msgAck: AQChatMSg.default.ExceptionMsg) {
		uni.showToast({
			title: `错误：${msgAck.getMsg()} code: ${msgAck.getCode()}`,
			duration: 2000,
			icon: 'error'
		});
		return;
    }
}