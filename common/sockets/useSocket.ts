import AQSender from './AQSender'
import AQMsgHandlerFactory from './msghandler/AQMsgHandlerFactory'
import AQChatMsgProtocol_pb, * as AQChatMSg from './protocol/AQChatMsgProtocol_pb'
import { useAppStore } from "../../store/modules/app"
export default ()=>{
  const appStore = useAppStore()
  
  // 初始化websocket
  const initSocketFun = () :void => {
    AQSender.getInstance().connect(()=>{
      console.log("连接成功...");
      appStore.setWebsocketStatus(true);
      let handlerFactory = AQMsgHandlerFactory.getInstance();
      AQSender.getInstance().onMsgReceived = (msgCommand,msgBody) =>{
        const result = handlerFactory.handle(msgCommand,msgBody);
        switch(msgCommand){
          case AQChatMSg.default.MsgCommand.USER_LOGIN_ACK:
            loginFun(result)
            break;
        }
      }
    })
  }

  // 登录
  const loginFun = (result:any)=>{
    appStore.setUserInfo(result)
	uni.navigateTo({url: "/pages/im/index"})
  }

  return {
    initSocketFun
  }
}