<template>
	<view class="content">
		<div class="theme-btn">
			<theme></theme>
		</div>
		<div class="svg-lottie">
			<lottie :src="LottieChat"></lottie>
		</div>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import theme from '../components/theme.vue'
	import lottie from '../components/lottie.vue'
	import LottieChat from '../../assets/json/lottie-chat.json';
</script>
<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: center;
		background-color: --bg-color;
		.theme-btn {
			padding: 10px 0px 5px 10px;
		}
	}
</style>