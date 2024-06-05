<script setup lang="ts">
	import { useAppStore } from './store/modules/app'
	import useSockets from './common/sockets/useSocket'
import { nextTick, onMounted } from "vue";
	
	const appStore = useAppStore()
	const { initSocketFun } = useSockets()
	const changeTheme = () => {
		const html = document.getElementsByTagName('html')[0];
		html.setAttribute('class', !appStore.themeDark ? 'light-theme' : 'dark-theme')
	}

	changeTheme()
	
	setTimeout(()=>{
		initSocketFun();
	},500)
</script>

<style lang="scss">
	@import '/static/assets/style/theme.scss';
	@import '/static/assets/style/animation.scss';
	@import '/static/assets/icon/iconfont.css';

	/*每个页面公共css */
	#app {
		background-color: var(--bg-color);
		color: var(--txt-color) !important;
	}

	uni-toast {
		z-index: 20000;
	}
</style>