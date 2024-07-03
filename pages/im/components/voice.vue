<template>
	<view class="player-container">
		<u-row gutter="1" justify="center" align="center">
			<u-col :span="1" class="play-btn" @click="playAndPause">
				<u-icon :name="playStatus ? 'play-circle-fill':'pause-circle-fill'"></u-icon>
			</u-col>
			<u-col :span="8" class="progress-bar">
				<u-line-progress :percent="progress" :show-percent="false"></u-line-progress>
			</u-col>
			<u-col :span="1" class="play-btn">
				<u-icon @click="downloadFile" style="margin-left: 10px;" name="arrow-downward"></u-icon>
			</u-col>
			<view class="time-display">{{ timePlay }} / {{ timeAll }}</view>
		</u-row>
	</view>
</template>

<script lang="ts" setup>
	import { defineProps, onMounted, ref, watch, onBeforeUnmount } from 'vue'
	const props = defineProps({
		src: {
			type: String,
			default: ''
		}
	})

	const audioInstance = ref()

	const playStatus = ref(true)

	const timeAll = ref('0:00')

	const timePlay = ref('0:00')
	
	const progress = ref<number>()

	const timer = ref()

	const { src } = props

	watch(() => src, (val) => {
		createAudioInstance()
	})

	const createAudioInstance = () => {
		audioInstance.value = uni.createInnerAudioContext()
		audioInstance.value.autoplay = false;
		audioInstance.value.src = src;
		if (audioInstance.value) {
			setTimeout(() => {
				getTime()
			}, 200)
		}
	}

	const playAndPause = () => {
		if (audioInstance.value) {
			if (playStatus.value) {
				audioInstance.value.play()
				getProgress()
			} else {
				audioInstance.value.pause()
				clearProcess()
			}
			playStatus.value = !playStatus.value
		}
	}

	const getTime = () => {
		let duration = audioInstance.value.duration
		timeAll.value = String((duration / 60).toFixed(2))
	}

	const getProgress = () => {
		timer.value = setInterval(() => {
			let duration = audioInstance.value.duration
			let currentTime = audioInstance.value.currentTime
			timeAll.value = String((duration / 60).toFixed(2))
			timePlay.value = String((currentTime / 60).toFixed(2))
			progress.value = Number((currentTime / duration * 100).toFixed(0))
		}, 200)
	}

	const clearProcess = () => {
		if (timer.value) {
			clearInterval(timer.value)
		}
	}

	// 下载文件
	const downloadFile = () => {
		const x = new XMLHttpRequest()
		x.open('GET', src, true)
		x.responseType = 'blob'
		x.onload = () => {
			const url = window.URL.createObjectURL(x.response)
			const a = document.createElement('a')
			a.href = url
			a.download = src.substring(src.lastIndexOf('/') + 1)
			a.click()
		}
		x.send()
	}

	onBeforeUnmount(() => {
		if (audioInstance.value) {
			audioInstance.value.pause()
			audioInstance.value.destroy()
		}
	})


	onMounted(() => {
		createAudioInstance()
	})
</script>

<style lang="scss">
	.player-container {
		width: 390rpx;
		border-radius: 5px;
		padding: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.02);
		position: relative;

		.play-btn {
			border-radius: 50%;
			cursor: pointer;
			margin-right: 10px;
		}

		.progress-bar {}

		.time-display {
			position: absolute;
			font-size: 15px;
			bottom: -6px;
		}
	}
</style>