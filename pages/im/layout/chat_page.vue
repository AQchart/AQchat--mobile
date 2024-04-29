<template>
	<view class="chat-page">
		<view class="large-btn">
			<view class="custom-icon icon-create">
				<span>创建群聊</span>
			</view>
		</view>
		<view class="large-btn">
			<view class="custom-icon icon-add">
				<span>加入群聊</span>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
	.chat-page {
		width: 100%;
		height: calc(100vh - 54px);

		.large-btn {
			width: 100%;
			height: calc((90vh - 54px) / 2);
			display: flex;
			justify-content: center;
			align-items: center;

			uni-view {
				display: inline-block;
				font-size: calc((90vh - 54px) / 2 / 2 / 2) !important;
				text-align: center;
				border-radius: 30px;
				padding: 20px 30px 30px 30px;
				background-color: #466AFB;
				position: relative;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
				color: var(--bg-color);
				&:hover {
					box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
				}
				span {
					position: absolute;
					font-size: 16px;
					left: calc((90vh - 54px) / 2 / 2 / 2 / 2 - 2px);
					bottom: 5px;
				}
			}
		}
	}
</style>