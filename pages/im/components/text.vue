<template>
	<view class="text-message">{{ text }}</view>
</template>

<script lang="ts" setup>
	import { ref, defineProps, computed } from 'vue'
	const props = defineProps({
		text: {
			type: String,
			default: ''
		}
	})
	
	const { text } = props
	
	const textLength = computed(() =>{
		return text.length
	})
	
</script>

<style lang="scss">
	.text-message {
		width: calc(100% - 20px);
		border-radius: 10px;
		background-color: var(--text-message-bg);
		color: var(--text-message-color);
	}
	
</style>