<template>
	<view class="im-page">
		<avatar></avatar>
		<chat-start></chat-start>
	</view>
</template>

<script setup lang="ts">
	import avatar from './layout/avatar.vue'
	import chatStart from './layout/chatStart.vue'
</script>

<style lang="scss">
	.im-page {
		color: var(--txt-color);
	}
</style>