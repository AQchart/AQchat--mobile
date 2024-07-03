<template>
	<view class="text-wait">
		<lottie class="icon-loading" :src="lottieLoading" />
		<div>{{AiWaitMsgInfo.msg}}</div>
	</view>
</template>

<script lang="ts" setup>
	import lottie from "../../components/lottie.vue";
	import lottieLoading from "/static/assets/json/lottie-loading.json";
	import { AiWaitMsgInfo } from "@/common/config"
	import { defineProps } from 'vue'
	const props = defineProps({
		text: {
			type: String,
			default: ''
		}
	})
</script>

<style lang="scss">
	.icon-loading {
		height: 80px !important;
	}
</style>