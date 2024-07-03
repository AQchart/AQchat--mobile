<template>
	<view class="chat-page">
		<lottie class="lottie-content" :src="lottieContent"></lottie>
		<u-grid class="grid-transparent" :col="2">
			<u-grid-item>
				<view class="large-btn">
					<view @click="createRoom">
						<i class="custom-icon icon-create"></i>
						<span>创建群聊</span>
					</view>
				</view>
			</u-grid-item>
			<u-grid-item>
				<view class="large-btn">
					<view @click="joinRoom">
						<i class="custom-icon icon-enter"></i>
						<span>加入群聊</span>
					</view>
				</view>
			</u-grid-item>
			<u-grid-item>
				<view class="large-btn">
					<view @click="intoAiSpace">
						<lottie class="lottie-ai" :src="lottieAi"></lottie>
						<span>AI空间</span>
					</view>
				</view>
			</u-grid-item>
		</u-grid>
		<room-dialog ref="roomDialogRef"></room-dialog>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import roomDialog from './roomDialog.vue'
	import lottie from "../../components/lottie.vue";
	import lottieContent from '/static/assets/json/lottie-content.json';
	import lottieAi from '/static/assets/json/lottie-ai.json';
	import { useAppStore } from '@/store/modules/app'
	import * as AQChatMSg from '@/common/sockets/protocol/AQChatMsgProtocol_pb';
	import AQSender from '@/common/sockets/AQSender'

	const roomDialogRef = ref(null)
	const appStore = useAppStore()
	const joinRoom = () => {
		appStore.setRoomType(0)
		if (appStore.roomInfo.roomId) {
			uni.showModal({
				title: '系统提示',
				content: `当前已加入聊天房【${appStore.roomInfo.roomName}】,是否恢复`,
				confirmText: '恢复房间',
				cancelText: '退出不管',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: "/pages/im/room"
						})
					} else if (res.cancel) {
						let model = new AQChatMSg.default.LeaveRoomCmd();
						model.setRoomid(appStore.roomInfo.roomId);
						AQSender.getInstance().sendMsg(
							AQChatMSg.default.MsgCommand.LEAVE_ROOM_CMD, model
						)
						setTimeout(() => {
							appStore.resetRoomInfo();
							roomDialogRef.value.show(false)
						}, 100)

					}
				}
			});
		} else {
			roomDialogRef.value.show(false)
		}
	}

	const intoAiSpace = () => {
		if (!appStore.websocketStatus) {
			uni.showModal({
				title: '系统提示',
				content: '服务已关闭，是否重新登录',
				confirmText: '确定',
				cancelText: '取消',
				type: "warning",
			}).then(res => {
				appStore.resetAllInfo();
				uni.navigateTo({
					url: "/pages/index/index"
				})
			})
			return
		}
		appStore.setRoomType(1)
		uni.showModal({
			title: '准备起飞',
			content: `AI Space是与 Gitee AI 联合推出的新型房间，意为用户提供智能问答、图像生成、语音处理等多种服务，是否开启AI空间体验？`,
			confirmText: 'AI空间，启动！',
			cancelText: '我再想想',
			success: (res) => {
				if (res.confirm) {
					let msg = new AQChatMSg.default.OpenAiRoomCmd();
					msg.setUserid(appStore.userInfo.userId);
					AQSender.getInstance().sendMsg(
						AQChatMSg.default.MsgCommand.OPEN_AI_ROOM_CMD, msg
					)
					uni.navigateTo({
						url: "/pages/im/room"
					})
				}
			},
		});
	}

	const createRoom = () => {
		if (appStore.roomInfo.roomId) {
			uni.showModal({
				title: '系统提示',
				content: `当前已加入聊天房【${appStore.roomInfo.roomName}】,是否恢复`,
				confirmText: '恢复房间',
				cancelText: '退出不管',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url: "/pages/im/room"
						})
					} else if (res.cancel) {
						let model = new AQChatMSg.default.LeaveRoomCmd();
						model.setRoomid(appStore.roomInfo.roomId);
						AQSender.getInstance().sendMsg(
							AQChatMSg.default.MsgCommand.LEAVE_ROOM_CMD, model
						)
						setTimeout(() => {
							appStore.resetRoomInfo();
							roomDialogRef.value.show(true)
						}, 100)
					}
				}
			});
		} else {
			roomDialogRef.value.show(true)
		}

	}
</script>

<style lang="scss" scoped>
	.chat-page {
		width: 100%;
		height: calc(100vh - 54px);
		position: relative;
		overflow: hidden;

		.grid-transparent {
			.u-grid-item {
				background-color: transparent !important;
			}

			.large-btn {
				width: 100%;
				height: calc((50vh - 54px) / 2);
				display: flex;
				justify-content: center;
				align-items: center;
				color: #fff;

				.lottie-ai {
					width: calc((60vh - 54px) / 2 / 2 / 2) !important;
				}

				uni-view {
					display: inline-block;
					font-size: calc((60vh - 54px) / 2 / 2 / 2) !important;
					text-align: center;
					border-radius: 30px;
					padding: 20px 30px 30px 30px;
					background-color: #466AFB;
					position: relative;
					box-shadow: 0 2px 12px 0 var(--large-btn-shadow);

					&:hover {
						box-shadow: 0 2px 12px 0 var(--large-btn-hover-shadow);
					}

					span {
						position: absolute;
						font-size: 16px;
						left: 0;
						text-align: center;
						width: 100%;
						bottom: 10px;
					}
				}
			}

		}

		.lottie-content {
			height: 95% !important;
			position: absolute;
			bottom: -200rpx;
			z-index: 0;
		}
	}
</style>