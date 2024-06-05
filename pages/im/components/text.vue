<template>
	<view class="text-message" v-html="text"></view>
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
		border-radius: 10px;
		color: var(--text-message-color);
		text-align: left;
		
		::v-deep * {
			white-space: wrap;
		}
	}
	
</style>