/**
* 消息渲染组件
* @author ghost
*/

<template>
	<view
		:class="['msg-item',message.msgType == MsgTypeEnum.TIP? 'center' : currentUser.userId == message.user.userId ? 'right':'left']">
		<view v-if="message.msgType == MsgTypeEnum.TIP" class="msg-tip msg-box">
			{{ message.msg }}
			<text v-if="message.msg.indexOf('撤回')!=-1 && message.ext" class='rewrite-box'
				@click='rewriteFun(message.ext)'>
				重新编辑
			</text>
		</view>
		<view v-else class="message-item">
			<img class="avatar" v-if="message.user.userId != appStore.userInfo.userId" :src="svgToDataURL(message.user.userAvatar)" alt="[头像]"/>
			<view class="message">
				<view class="name" :style="{textAligh: currentUser.userId == message.user.userId ? 'right': 'left'}">
					{{ message.user.userName }}
				</view>
				<view class="message-box"
					:class="currentUser.userId == message.user.userId ? 'right-after': 'left-after'">
					<component :is="getMessageType()" v-bind="getProps" @longpress.native="onLongPress"
						@tap.native="listTap">
					</component>
				</view>
			</view>
			<img class="avatar" v-if="message.user.userId == appStore.userInfo.userId" :src="svgToDataURL(message.user.userAvatar)" alt="[头像]"/>
			<loading v-if="message.msgStatus === MsgStatusEnum.PENDING" class="mine-load" />
		</view>
		<view class="shade" v-show="showShade" @tap="hidePop">
			<view class="pop" :style="popStyle" :class="{'show':showPop}">
				<view v-if="message.user.userId == appStore.userInfo.userId" @click="recallMsgFun">撤回</view>
				<view v-if="message.msgType == MsgTypeEnum.TEXT" @click="copyMsg">复制</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import loading from "./loading.vue"
	import { defineProps, onMounted, computed } from 'vue'
	import text from './text.vue'
	import image from './image.vue'
	import voice from './voice.vue'
	import video from './video.vue'
	import file from './file.vue'
	import wait from './wait.vue'
	import MsgTypeEnum from "@/enums/MsgTypeEnum"
	import MsgStatusEnum from "@/enums/MsgStatusEnum"
	import { ref, nextTick, defineEmits } from 'vue'
	import AQSender from '@/common/sockets/AQSender'
	import * as AQChatMSg from '@/common/sockets/protocol/AQChatMsgProtocol_pb';
	import { useAppStore } from '@/store/modules/app'

	// props
	const props = defineProps({
		message: {
			type: Object,
			default: () => { }
		},
		currentUser: {
			type: Object,
			default: () => { }
		}
	})
	const emits = defineEmits(['rewrite'])
	const appStore = useAppStore()
	// 解析消息
	const { message, currentUser } = props
	/* 窗口尺寸 */
	const winSize = ref({ width: 0, height: 0 });
	/* 显示遮罩 */
	const showShade = ref(false);
	/* 显示操作弹窗 */
	const showPop = ref(false)
	/* 弹窗定位样式 */
	const popStyle = ref("")

	onMounted(() => {
		getWindowSize();

		// #ifdef H5
		document.onLong = function (e) {
			var e = e || window.event;
			e.preventDefault();
		};
		// #endif
	})
	
	// 复制
	const copyMsg = () => {
		uni.setClipboardData({
			data: message.msg,
			showToast: false,
			success() {
				uni.showToast({
					title: '复制成功',
					icon: 'none'
				});
			}
		})
	}
	
	
	const svgToDataURL = (html : any) => {
		if(html.indexOf('png') != -1) {
			return html
		}
		const toolElm = document.createElement('div')
		toolElm.innerHTML = html
		const svgElement = toolElm.firstChild
		if (!svgElement) return null
		return 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svgElement))
	}

	/* 列表触摸事件 */
	const listTap = () => {
		/* 因弹出遮罩问题，所以需要在遮罩弹出的情况下阻止列表事件的触发 */
		if (showShade.value) {
			return;
		}

		console.log("列表触摸事件触发")
	}

	/* 获取窗口尺寸 */
	const getWindowSize = () => {
		uni.getSystemInfo({
			success: (res) => {
				winSize.value.width = res.windowWidth
				winSize.value.height = res.windowHeight
			}
		})
	}

	// 撤回消息
	const recallMsgFun = () => {
		if(message.user.userId != appStore.userInfo.userId) {
			return
		}
		let model = new AQChatMSg.default.RecallMsgCmd();
		model.setRoomid(appStore.roomInfo.roomId);
		model.setMsgid(message.msgId);
		AQSender.getInstance().sendMsg(
			AQChatMSg.default.MsgCommand.RECALL_MSG_CMD, model
		)
		hidePop();
	}

	/* 长按监听 */
	const onLongPress = (e : any) => {
		console.log("长按");
		// if (message?.user?.userId != appStore.userInfo.userId) {
		// 	return
		// }
		let [touches, style, index] = [e.touches[0], "", e.currentTarget.dataset.index];

		/* 因 非H5端不兼容 style 属性绑定 Object ，所以拼接字符 */
		if (touches.clientY > (winSize.value.height / 2)) {
			style = `bottom:${winSize.value.height - touches.clientY}px;`;
		} else {
			style = `top:${touches.clientY}px;`;
		}
		if (touches.clientX > (winSize.value.width / 2)) {
			style += `right:${winSize.value.width - touches.clientX}px`;
		} else {
			style += `left:${touches.clientX}px`;
		}

		popStyle.value = style;
		showShade.value = true;
		nextTick(() => {
			setTimeout(() => {
				showPop.value = true;
			}, 10);
		});
	}
	/* 隐藏弹窗 */
	const hidePop = () => {
		showPop.value = false;
		setTimeout(() => {
			showShade.value = false;
		}, 250);
	}

	// 获取消息组件
	const getMessageType = () => {
		switch (message.msgType) {
			case MsgTypeEnum.TEXT:
				return text
			case MsgTypeEnum.IMAGE:
				return image
			case MsgTypeEnum.VOICE:
				return voice
			case MsgTypeEnum.VIDEO:
				return video
			case MsgTypeEnum.FILE:
				return file
			case MsgTypeEnum.WAIT:
				return wait
			default: break;
		}
	}

	// 重新编辑
	const rewriteFun = (ext : any) => {
		// imCharRef.value && imCharRef.value.rewriteFun(ext)
		emits("rewrite", ext)
	}

	// 获取消息组件props
	const getProps = computed(() => {
		switch (message.msgType) {
			case MsgTypeEnum.TEXT:
				return { text: message.msg, userId: message.user.userId }
			case MsgTypeEnum.IMAGE:
				return { src: message.msg }
			case MsgTypeEnum.VOICE:
				return { src: message.msg }
			case MsgTypeEnum.VIDEO:
				return { src: message.msg }
			case MsgTypeEnum.FILE:
				return { src: message.msg, ext: message.ext }
			case MsgTypeEnum.WAIT:
				return { text: message.msg }
			default:
				return {}
		}
	})
</script>

<style lang="scss" scoped>
	/* 遮罩 */
	.shade {
		position: fixed;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		-webkit-touch-callout: none;

		.pop {
			position: fixed;
			z-index: 101;
			width: 200upx;
			box-sizing: border-box;
			font-size: 28upx;
			text-align: left;
			color: #333;
			background-color: #fff;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
			line-height: 80upx;
			transition: transform 0.15s ease-in-out 0s;
			user-select: none;
			-webkit-touch-callout: none;
			transform: scale(0, 0);

			&.show {
				transform: scale(1, 1);
			}

			&>view {
				padding: 0 20upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				user-select: none;
				-webkit-touch-callout: none;

				&:active {
					background-color: #f3f3f3;
				}
			}
		}
	}

	.msg-item {
		display: flex;
		padding: 23rpx 30rpx;
		margin-top: 10px;
		width: 100%;

		&:first-child {
			margin-top: 5px;
		}
	}

	::v-deep .emo-image {
		height: 40rpx;
		width: 40rpx;
		vertical-align: middle;
		display: inline-block;
	}

	.msg-tip {
		text-align: center;
		font-size: 24rpx;
		color: #ccc;
		margin: 0 auto;

		.rewrite-box {
			margin-left: 10px;
			color: var(--im-primary);
			position: relative;
			cursor: pointer;
		}
	}

	.message-item {
		border-radius: 10px;
		position: relative;
		display: flex;
		flex-direction: row;

		.mine-load {
			position: absolute;
			left: -20rpx;
			top: calc(50% + 26rpx);
			transform: translateY(-50%);
		}

		.avatar {
			display: flex;
			width: 80rpx;
			height: 80rpx;
			position: relative;
			box-shadow: 0 2px 12px 0 var(--avatar-shadow);
			border-radius: 50px;
		}

		.message {
			display: flex;
			margin-right: 20px;
			margin-left: 20px;
			flex-direction: column;

			.name {
				color: var(--txt-color);
				;
			}

			.message-box {
				margin-top: 5px;
				background-color: var(--im-txt-bg);
				border-radius: 5px;
				padding: 10px;
				color: var(--text-message-color);
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: 500;
				max-width: 486rpx;
				word-wrap: break-word;

				view {
					flex: auto;
					max-width: 486rpx;
					word-wrap: break-word;
				}



			}

			.right-after {
				&::after {
					position: absolute;
					display: inline-block;
					content: '';
					width: 0;
					height: 0;
					left: 602rpx;
					top: 45px;
					border: 12rpx solid transparent;
					border-left: 20rpx solid var(--text-message-bg);
				}
			}

			.left-after {
				&::after {
					position: absolute;
					display: inline-block;
					content: '';
					width: 0;
					height: 0;
					top: 45px;
					right: 602rpx;
					border: 12rpx solid transparent;
					border-right: 20rpx solid var(--text-message-bg);
				}
			}
		}
	}

	.left {
		justify-content: flex-start;
		text-align: left;
	}

	.right {
		justify-content: flex-end;
		text-align: right;
	}

	.center {
		justify-content: center;
	}
</style>