import { defineStore } from 'pinia'

interface UserInfo {
	userId : String,
	userName : String,
	userAvatar : String
}

interface AppState {
	websocketStatus : boolean,
	userInfo : UserInfo,
	themeDark : boolean
}

export const useAppStore = defineStore('app', {
	state: () : AppState => ({
		websocketStatus: false,
		userInfo: {
			userId: '',
			userName: '',
			userAvatar: ''
		},
		themeDark: uni.getStorageSync('app-darkTheme') || false
	}),
	getters: {
		theme: (state) => state.themeDark,
	},
	actions: {
		setTheme(theme : boolean) {
			this.themeDark = theme
			uni.setStorageSync('app-darkTheme', theme)
		},
		setUserInfo(userInfo : UserInfo) {
			this.userInfo = userInfo
		},
		setWebsocketStatus(status : boolean) {
			this.websocketStatus = status
		},
	},
	persist: {
		storage: {
			getItem: uni.getStorageSync,
			setItem: uni.setStorageSync
		}
	},
})