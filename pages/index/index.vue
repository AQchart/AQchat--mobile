<template>
	<view class="content">
		<view class="theme-btn">
			<theme></theme>
		</view>
		<view class="star-tips">
			您的
			<span style="color: #fcbd71;">Star</span>
			是我们更新的动力，期待你的
			<u-icon name="star"></u-icon>
			<span class="go-star" @click="goStar">去Star</span>
		</view>
		<view class="svg-lottie">
			<lottie :src="LottieChat"></lottie>
		</view>
		<view class="chat-text bounce_fall">
			AQChat
		</view>
		<view class="chat-text-printer">{{ descText }}</view>
		<view class="hot-point-list">
			<swiper :autoplay="true" :interval="2000">
				<swiper-item class="hot-point-item" v-for="(row,index) in advantageList" @click="toUrl(row)"  :key="index">
					<view class="title">{{ row.title }}</view>
					<view class="desc" v-html="row.desc"></view>
				</swiper-item>
				<swiper-item class="hot-point-item">
					<view class="title" @click="giteeHub">🚝仓库</view>
					<view class="desc">
						<span class="git-name" @click="giteeHub">AQChat</span>
						<a href="https://gitee.com/howcode/aq-chat/stargazers">
							<img src="https://gitee.com/howcode/aq-chat/badge/star.svg?theme=dark" alt="star">
						</a>
						<a href="https://gitee.com/howcode/aq-chat/members">
							<img src="https://gitee.com/howcode/aq-chat/badge/fork.svg?theme=dark" alt="fork">
						</a>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="start-btn" @click="toStartPage">
			<u-icon name="rewind-right"></u-icon> 开启
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import theme from '../components/theme.vue'
	import lottie from '../components/lottie.vue'
	import LottieChat from '/static/assets/json/lottie-chat.json';
	import useTyping from '../hook/usePrinter'

	const text = ref('一个极速、便捷的在线匿名聊天室')
	const descText = ref('')

	const { startTyping } = useTyping()

	setTimeout(() => {
		startTyping(text.value, descText)
	}, 1000)
	
	const toUrl = (row:any)=>{
	  if(!row.url) return
	  window.open(row.url,row.title)
	}

	const goStar = () => {
		window.open('https://gitee.com/howcode/aq-chat')
	}

	const giteeHub = () => {
		window.open('https://gitee.com/howcode/aq-chat')
	}

	const toStartPage = () => {
		uni.navigateTo({
			url: "/pages/start/index"
		})
	}


	const advantageList = [
		{
			title: '🚀即时通讯',
			desc: 'protobuf协议轻便快捷，采用Netty实现高效处理'
		},
		{
			title: '🎯便捷',
			desc: '即开即用，无需一切繁琐操作'
		},
		{
			title: '✨简单',
			desc: '0引导，所见即所得'
		},
		{
			title: "🚝官网文档",
			desc: "AQChat文档中心</br>详细的部署教程、设计思路等",
			url: 'https://docs.aqchat.run/'
		},
	]
</script>
<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: center;
		color: var(--txt-color);

		.star-tips {
			position: absolute;
			top: 100rpx;
			width: 96%;
			height: 41rpx;
			left: 2%;
			background-color: #fdf6ec;
			border: 1px solid #fcbd71;
			border-radius: 4px;
			color: #f90;
			text-align: center;

			.go-star {
				cursor: pointer;
				color: #2979ff;
			}
		}

		.theme-btn {
			padding: 10px 0px 5px 10px;
		}

		.svg-lottie {
			width: 50%;
			margin: 0px 25% 0px 25%;
		}

		.chat-text {
			text-align: center;
			font-size: 25px;
			font-style: italic;
			font-weight: 600;
			letter-spacing: 5px;
		}

		.chat-text-printer {
			text-align: center;
			font-size: 18px;
			min-height: 30px;
			margin-top: 20px;
		}

		.hot-point-list {
			padding: 24rpx;

			.hot-point-item {
				padding: 10px 10px;
				border-radius: 10px;
				font-family: 'Times New Roman', Times, serif;

				.title {
					width: 100%;
					font-size: 25px;
					text-align: left;
				}

				.desc {
					width: 100%;
					margin-top: 5px;
					font-size: 15px;

					.git-name {
						margin-right: 4px;
					}
				}
			}
		}

		.start-btn {
			margin-top: 20px;
			font-size: 24px;
			font-family: "YYZY";
			background-color: var(--im-primary);
			;
			color: #fff;
			text-align: center;
			cursor: pointer;
			transition: all 0.3s ease-in-out;
			border-radius: 50px;
			margin: 10px 20% 0px 20%;
			height: 60px;
			outline: none;
			border: none;
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;

			&:hover {
				transform: translateY(3px);
				box-shadow: none;
			}

			&:active {
				opacity: 0.5;
			}
		}
	}

	.bounce_fall {
		animation: bounce_fall 1s linear;
	}
</style>