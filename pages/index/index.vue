<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>

		<u-action-sheet :list="list" v-model="show"></u-action-sheet>
		<u-icon name="photo"></u-icon>
	</view>
</template>

<script>
	export default {
		data() {
		data() { 



			return {
				title: 'Hello'
				title: 'Hello',
				list: [{
						text: '测试',
						color: 'blue',
						fontSize: 28
					},
					{
						text: 1
					},
					{
						text: 111
					}
				],
				show: true
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
</style>