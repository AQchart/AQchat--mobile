<template>
	<u-tabbar v-model="currentTab" :list="tabBarList" bg-color="var(--tabbar-bg-color)" active-color="var(--tabbar-active-color)"></u-tabbar>
</template>

<script setup lang="ts">
	import { ref, onMounted, watch, defineEmits } from 'vue'
	const tabBarList = [
		{
			iconPath: "chat",
			selectedIconPath: "chat-fill",
			text: '消息',
			count: 2,
			isDot: false,
			customIcon: false,
		},
		{
			iconPath: "account",
			selectedIconPath: "account-fill",
			text: '我的',
			count: 0,
			isDot: false,
			customIcon: false,
		}
	]
	const currentTab = ref(0)
	
	const emit =  defineEmits(['switchTab'])
	
	watch(currentTab, (val) => {
		emit('switchTab', val)
	})
</script>

<style lang="scss">
</style>