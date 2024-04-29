<template>
	<view class="content">
		<view class="theme-btn">
			<theme></theme>
		</view>
		<view class="svg-lottie">
			<lottie :src="LottieChat"></lottie>
		</view>
		<view class="chat-text bounce_fall">
			Anonymous Quick Chat
		</view>
		<view class="chat-text-printer">{{ descText }}</view>
		<view class="hot-point-list">
			<u-row class="hot-point-item" v-for="(row,index) in advantageList" :style="getTextAligh(index)"
				:key="index">
				<view class="title">{{ row.title }}</view>
				<view class="desc">{{ row.desc }}</view>
			</u-row>
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
	import LottieChat from '../../assets/json/lottie-chat.json';
	import useTyping from '../hook/usePrinter'

	const text = ref('一个极速、便捷的在线匿名聊天室')
	const descText = ref('')

	const { startTyping } = useTyping()

	setTimeout(() => {
		startTyping(text.value, descText)
	}, 1000)

	const getTextAligh = (index : Number) => {
		return {
			textAlign: index == 0 ? 'left' : index == 1 ? 'center' : 'right'
		}
	}
	
	const toStartPage = () => {
		uni.navigateTo({
			url: "/pages/start/index"
		})
	}


	const advantageList = [
		{
			title: '🚀即时通讯',
			desc: '采用Netty实现高效处理，protobuf协议轻便快捷'
		},
		{
			title: '🎯便捷',
			desc: '即开即用，无需一切繁琐操作'
		},
		{
			title: '✨简单',
			desc: '所见即所得，0引导'
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
				padding: 20px 10px;
				border-bottom: 12px solid var(--ad-shadow);
				border-radius: 10px;
				font-family: 'Times New Roman', Times, serif;

				.title {
					width: 100%;
					font-size: 25px;
				}

				.desc {
					width: 100%;
					margin-top: 5px;
				}
			}
		}

		.start-btn {
			margin-top: 20px;
			font-size: 24px;
			font-family: "YYZY";
			background-color: #466AFB;
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
			background-image: linear-gradient(135deg, #92a4fe 0%, #466AFB 100%);
			box-shadow: 0 20px 30px -6px rgba(70, 106, 251, 0.5);
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