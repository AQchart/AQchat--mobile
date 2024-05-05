<template>
	<view>
		<u-image :src="src">
			<template v-slot:error>
				<view style="font-size: 24rpx;">加载失败</view>
			</template>
		</u-image>
		<u-popup v-model="show" mode="center" custom-style="view-image-full" :closeable="true">
			<u-image :src="src">
				<template v-slot:error>
					<view style="font-size: 24rpx;">加载失败</view>
				</template>
			</u-image>
		</u-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref, defineProps } from 'vue'
	const props = defineProps({
		src: {
			type: String,
			default: ''
		}
	})

	const show = ref(false)

	const { src } = props
</script>

<style lang="scss" scoped>
	.view-image-full {
		::v-deep .u-mode-center-box {
			background-color: transparent;
			width: 100%;
			height: 100%;
		}
	}
</style>