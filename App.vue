<script setup lang="ts">
	import { ref, onMounted, nextTick } from 'vue'

	import { useAppStore } from './store/modules/app'
	import useSockets from './common/sockets/useSocket'
	const appStore = useAppStore()

	const initSockets = useSockets()


	const changeTheme = () => {
		const html = document.getElementsByTagName('html')[0];
		html.setAttribute('class', !appStore.themeDark ? 'light-theme' : 'dark-theme')
	}

	const initCall = () => {
		if (!appStore.websocketStatus) {
			uni.showToast({
				title: '连接服务器失败！',
				icon: 'error',
				duration: 2000
			})
		}
	}

	changeTheme()
	setTimeout(() => {
		initSockets.initSocketFun()
		initCall()
	}, 1000)
</script>

<style lang="scss">
	@import './assets/style/theme.scss';
	@import './assets/style/animation.scss';
	@import './assets/icon/iconfont.css';

	/*每个页面公共css */
	#app {
		background-color: var(--bg-color);
		color: var(--txt-color);
	}

	uni-toast {
		z-index: 20000;
	}
</style>