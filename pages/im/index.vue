<template>
	<view class="im-page">
		<component :is="currentComponent == 0 ? chatPage: userPage"></component>
		<!-- <tabbar @switchTab="switchTab"></tabbar> -->
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import tabbar from './layout/tabbar.vue'
	import chatPage from './layout/chat_page.vue'
	import userPage from './layout/user_page.vue'
	const currentComponent = ref(0)
	const switchTab = (page : number) => {
		currentComponent.value = page
	}
</script>

<style lang="scss">
	.im-page {
		color: var(--txt-color);
	}
</style>