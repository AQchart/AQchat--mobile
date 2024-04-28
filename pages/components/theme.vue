<template>
	<u-switch :class="light ? 'theme-switch-light': 'theme-switch-dark'" active-color="#409eff" inactive-color="#dcdfe6"
		v-model="light"></u-switch>
</template>

<script lang="ts" setup>
	import { ref, watch } from 'vue'
	const light = ref(true)
	watch(light, (val) => {
		const html = document.getElementsByTagName('html')[0];
		html.setAttribute('class', val ? 'light-theme' : 'dark-theme')
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
				content: "\e6b6";
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
				content: "\e62e";
				position: absolute;
				left: 2px;
				font-size: calc(100% - 6px);
				border-radius: 2px;
			}
		}
	}
</style>