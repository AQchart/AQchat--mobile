<!--
 * @Author: howcode 1051495009@qq.com
 * @Date: 2024-07-02 20:48:48
 * @LastEditors: howcode 1051495009@qq.com
 * @LastEditTime: 2024-07-02 21:46:59
 * @Description: 特别鸣谢
-->
<template>
	<div class="thanks-container">
		<div class="tip">
			特别鸣谢以下对本开源项目的支持！
			<div class="txt">（排列不分先后）</div>
		</div>
		<div class="thanks-list">
			<div @click="toLink(item.url)" class="thanks-item" v-for="item in thanksList" :key="item.title">
				<img :src="item.cover" class="cover" alt="">
				<div class="info">
					<div class="title">{{ item.title }}</div>
					<div class="desc">{{ item.desc }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	const thanksList = [
		{
			title: 'Gitee AI',
			url: 'https://ai.gitee.com/serverless-api',
			cover: 'https://ai-assets.gitee.com/_next/static/media/logo-full.e6d11034.svg',
			desc: '基于 Gitee AI 与芯格科技联合研发的 Serverless 推理引擎 为 AI 开发者提供开箱即用的大模型推理 API 服务。'
		},
		{
			title: 'ChatArea',
			url: 'https://www.jianfv.top/ChatAreaDoc/',
			cover: 'https://www.jianfv.top/ChatAreaDoc/assets/logo-5e6c3853.png',
			desc: '一个开箱即用的聊天框库，配置简单，几行代码即可生成使用，集成了常见聊天框交互功能。'
		},
	]

	const toLink = (url) => {
		window.open(url)
	}
</script>

<style lang="less" scoped>
	.thanks-container {
		width: 100%;
		height: 100vh;
		background: var(--bg-color);
		padding: 100px 0;

		.tip {
			font-size: 24px;
			margin-bottom: 40px;
			color: #4D5FFF;

			.txt {
				margin-top: 6px;
				font-size: 14px;
				color: var(--txt-color);
			}
		}

		.thanks-list {
			width: 100%;
			margin: 0 auto;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			justify-content: center;
		}

		.thanks-item {
			margin-left: 20px;
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			background-color: #fff;
			padding: 10px 20px;
			border-radius: 10px;
			cursor: pointer;

			&:hover {
				box-shadow: 0 0 10px var(--thanks-bg);
			}

			.cover {
				width: 80px;
				height: 40px;
			}

			.info {
				width: 200px;
				margin-left: 20px;
				text-align: left;
				color: #333;

				.title {
					font-size: 18px;
				}

				.desc {
					font-size: 12px;
				}
			}
		}
	}
</style>