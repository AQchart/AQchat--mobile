import { ref, reactive, onMounted } from 'vue'
import multiavatar from "@multiavatar/multiavatar/esm"
import AQSender from '../../common/sockets/AQSender'
import AQMsgHandlerFactory from '../../common/sockets/msghandler/AQMsgHandlerFactory'
import AQChatMsgProtocol_pb, * as AQChatMSg from '../../common/sockets/protocol/AQChatMsgProtocol_pb'
import CallbackMethodManager from '../../common/sockets/CallbackMethodManager';
import { useAppStore } from '../../store/modules/app'


export default () => {

	interface UserForm {
		userName : string,
		userAvatar : string
	}
	const step = ref(1)
	const userForm = reactive<UserForm>({
		userName: '',
		userAvatar: ''
	})
	const reloadLoading = ref(true)

	const appStore = useAppStore()

	onMounted(() => {
		userForm.userName = generateUsernameFun(4)
		initAvatar()
	})

	// 生成随机名
	const generateUsernameFun = (length : number) => {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let username = '';
		for (let i = 0; i < length; i++) {
			username += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return username;
	}

	const initAvatar = () => {
		userForm.userAvatar = multiavatar(userForm.userName)
	}

	// 点击开启
	const toStartFun = () => {
		userForm.userName = generateUsernameFun(4);
		initAvatar()
	}

	// 重新生成用户头像、姓名
	const reloadFun = () => {
		reloadLoading.value = false;
		setTimeout(() => {
			reloadLoading.value = true;
			userForm.userName = generateUsernameFun(4)
			initAvatar()
		}, 100)
	}

	const navigateToIm = (res : any) => {
		appStore.setUserInfo(res)
		uni.navigateTo({ url: "/pages/im/index" })
	}

	// 进入聊天室
	const enterChatFun = () => {
		if (!appStore.websocketStatus) {
			uni.showToast({
				title: "服务器连接异常！",
				icon: 'error'
			})
		}
		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.USER_LOGIN_CMD,
			new AQChatMSg.default.UserLoginCmd([userForm.userName, userForm.userAvatar])
		);
	}


	return {
		step,
		userForm,
		reloadLoading,
		toStartFun,
		reloadFun,
		enterChatFun
	}
}