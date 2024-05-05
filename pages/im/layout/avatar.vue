<template>
	<view class="user-avatar">
		<view class="avatar" v-html="appStore.userInfo.userAvatar"></view>
		<span class="user-name">{{ daySpace }}：{{ appStore.userInfo.userName }}</span>
		<view class="empty"></view>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { useAppStore } from '../../../store/modules/app'
	const appStore = useAppStore()

	const daySpace = ref('')

	const getDaySpace = () => {
		const hours = new Date().getHours()
		daySpace.value = (hours >= 6 && hours < 10) ? "早上好" :
			(hours >= 10 && hours < 12) ? "中午好" :
				(hours >= 12 && hours < 18) ? "下午好" : "晚上好"
	}

	onMounted(() => {
		getDaySpace()
	})
</script>

<style lang="scss" scoped>
	.user-avatar {
		width: 100%;
		height: 50px;
		min-height: 100%;
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
		top: 5px;
		left: 5px;

		.avatar {
			flex: 0 0 auto;
			width: 50px;
			height: 50px;
			position: relative;
			z-index: 1;
			box-shadow: 0 2px 12px 0 var(--avatar-shadow);
			border-radius: 50px;
		}

		.user-name {
			line-height: 50px;
			flex: 0 0 auto;
			padding-right: 10px;
			position: relative;
			left: -25px;
			padding-left: 30px;
			background-color: #466AFB;
			color: #fff;
			border-top-right-radius: 30px;
			border-bottom-right-radius: 30px;
			z-index: 0;
			max-width: calc(100% - 90px);
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			box-shadow: 0 2px 12px 0 var(--user-name-shadow);
		}

		.empty {
			flex: 1 1 auto;
		}
	}
</style>