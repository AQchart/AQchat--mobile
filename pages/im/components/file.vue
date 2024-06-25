<template>
	<view class="file-message">
		<view class="file-top" @click="showFileMore">
			<view class="info nowrap-2">
				{{ ext }}
			</view>
			<img class="icon-file" src="/static/assets/images/icon-file.png" alt="">
		</view>
		<view class="file-bottom">文件</view>
		<u-popup v-model="show" class="view-file-pupop" mode="center" :closeable="true">
			<view class="file-preview">
				<img class="icon-file" src="/static/assets/images/icon-file.png" alt="">
				<view class="name">{{ ext }}</view>
				<u-button class="down-btn" size="medium" type="primary" @click="downloadFile">下载</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script lang="ts" setup>
	import { ref, defineProps } from 'vue'
	const props = defineProps({
		src: {
			type: String,
			default: ''
		},
		ext: {
			type: String,
			default: ''
		}
	})

	/**
	 * src: 文件下载地址
	 * ext: 文件名称
	 */
	const { src, ext } = props
	// 显示下载弹窗
	const show = ref(false)
	// 下载文件
	const downloadFile = () => {
		const x = new XMLHttpRequest()
		  x.open('GET', src, true)
		  x.responseType = 'blob'
		  x.onload = () => {
		    const url = window.URL.createObjectURL(x.response)
		    const a = document.createElement('a')
		    a.href = url
		    a.download = ext
		    a.click()
		  }
		  x.send()
	}
	// 显示文件更多操作
	const showFileMore = () => {
		show.value = true
	}
	
</script>

<style lang="scss" scoped>
	.file-message {
		width: 380rpx;
		height: 90rpx;
		border-radius: 4px;
		background-color: var(--file-card-bg);
		cursor: pointer;

		&:focus-visible {
			outline: none;
		}

		.file-top {
			padding: 5px;
			height: 50rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;

			.info {
				width: calc(100% - 100rpx);
				font-size: 35rpx;
				color: var(--file-card-txt);
				text-align: left;
				line-height: 60rpx;
				white-space: nowrap;
				overflow:hidden;
				text-overflow:ellipsis;
			}
		}

		.file-bottom {
			height: 30rpx;
			line-height: 30rpx;
			font-size: 25rpx;
			color: var(--file-card-desc);
			text-align: left;
			padding-left: 5px;
			border-top: 1px solid rgba(231, 231, 231, .5);
		}
	}
	
	.icon-file {
		width: 80rpx;
		height: auto;
	}
	
	.file-preview {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow:hidden;
		text-overflow:ellipsis;
		
		img {
			margin-top: 200rpx;
			margin-bottom: 20rpx;
		}
		.down-btn {
			margin-top: 20rpx;
		}
		
		.name {
			width: 100%;
			font-size: 40rpx;
			text-align: center;
			overflow:hidden;
			text-overflow:ellipsis;
		}
	}
	
	.view-file-pupop{
		::v-deep .u-mode-center-box {
			width: 60% !important;
			height: 40% !important;
			border-radius: 10px;
			color: var(--txt-color);
			background-color: var(--bg-color);
		}
	}
</style>