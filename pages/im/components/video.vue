<template>
	<view>
		<video class="video-box" :src="src" @click="showProp" width="100%" height="100%" controls="">
			
		</video>
		<u-popup v-model="show" mode="center" custom-style="view-image-full" :closeable="true">
			<video :src="src" autoplay="autoplay" controls>
				
			</video>
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
	
	const showProp = () => {
		show.value = true
	}

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
	.video-box{
		width: 245px;
		height: 225px;
	}
</style>