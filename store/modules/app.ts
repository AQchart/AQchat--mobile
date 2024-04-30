import { defineStore } from 'pinia'

interface UserInfo {
	userId : String,
	userName : String,
	userAvatar : String
}

interface RoomInfo {
	roomId : string,
	roomNo : number,
	roomName : string,
}


interface AppState {
	websocketStatus : boolean,
	userInfo : UserInfo,
	themeDark : boolean,
	roomInfo : RoomInfo
}
export const useAppStore = defineStore('app', {
	unistorage: true, // 是否持久化
	state: () : AppState => ({
		websocketStatus: false,
		userInfo: {
			userId: '',
			userName: '',
			userAvatar: ''
		},
		themeDark: false,
		roomInfo: {
			roomId: '',
			roomNo: null,
			roomName: '',
		}
	}),
	getters: {
		theme: (state) => state.themeDark,
	},
	actions: {
		setTheme(theme : boolean) {
			this.themeDark = theme
		},
		setUserInfo(userInfo : UserInfo) {
			this.userInfo = userInfo
		},
		setWebsocketStatus(status : boolean) {
			this.websocketStatus = status
		},
		setRoomInfo(info: RoomInfo) {
			this.roomInfo = info
		}
	}
})