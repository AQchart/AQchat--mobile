<template>
	<u-switch :class="dark ? 'theme-switch-dark': 'theme-switch-light'" active-color="#409eff" inactive-color="#dcdfe6"
		v-model="dark"></u-switch>
</template>

<script lang="ts" setup>
	import { ref, watch } from 'vue'
	import { useAppStore } from '../../store/modules/app'
	
	const appStore = useAppStore()

	const dark = ref(appStore.themeDark || false)
	watch(dark, (val) => {
		const html = document.getElementsByTagName('html')[0];
		html.setAttribute('class', val ? 'dark-theme' : 'light-theme')
		appStore.setTheme(val)
	})
</script>

<style lang="scss" scoped>
	@font-face {
		font-family: "iconfont";
		/* Project id  */
		src: url('/assets/fonts/iconfont.ttf?t=1714124436680') format('truetype');
	}


	.theme-switch-dark {
		font-family: "iconfont" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		::v-deep .node-class {
			color: var(--switch-color) !important;
			&:before {
				content: "\e781";
				position: absolute;
				left: 2px;
				font-size: calc(100% - 5px);
				border-radius: 2px;
			}
		}
	}

	.theme-switch-light {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		::v-deep .node-class {
			color: var(--switch-color) !important;
			&:before {
				content: "\e769";
				position: absolute;
				left: 2px;
				font-size: calc(100% - 6px);
				border-radius: 2px;
			}
		}
	}
</style>