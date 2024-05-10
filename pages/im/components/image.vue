<template>
	<view class="image-message">
		<u-image :src="src" width="100%" height="100%" @click="preview">
			<template v-slot:error>
				<view style="font-size: 24rpx;">加载失败</view>
			</template>
		</u-image>
		<u-popup v-model="show" mode="center" class="view-image-full" :closeable="true">
			<u-image :src="src" mode="widthFix" style="padding-top: 450rpx;">
				<template v-slot:error>
					<view style="font-size: 24rpx;">加载失败</view>
				</template>
			</u-image>
		</u-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref, defineProps, computed, withModifiers } from 'vue'
	const props = defineProps({
		src: {
			type: String,
			default: ''
		}
	})

	const show = ref(false)

	const { src } = props
	
	const preview = () => {
		show.value = true
	}
</script>

<style lang="scss" scoped>
	
	.image-message {
		width: 450rpx;
		height: 330rpx;
	}
	.view-image-full {
		::v-deep .u-mode-center-box {
			background-color: transparent;
			width: 100% !important;
			height: 100% !important;
		}
	}
</style>