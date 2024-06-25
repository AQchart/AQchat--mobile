<template>
	<view class="text-message" v-if="props.userId != 'AQChatHelper'" v-html="html">
	</view>
	<view class="text-message" v-else>
		<UaMarkDown :source="html" />
	</view>
</template>

<script lang="ts" setup>
	import { defineProps, onMounted, ref, watch } from 'vue'
	import UaMarkDown from '../../components/ua-markdown/ua-markdown.vue'
	const props = defineProps({
		text: {
			type: String,
			default: ''
		},
		userId: {
			type: String,
			default: ''
		}
	})

	const html = ref('')

	watch(() => props.text, (newVal) => {
		html.value = newVal
	})
	onMounted(() => {
		html.value = props.text
		console.log(props.userId)
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