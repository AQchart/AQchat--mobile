<template>
	<view class="chat-page">
		<lottie class="lottie-content" :src="lottieContent"></lottie>
		<view class="large-btn">
			<view class="custom-icon icon-create" @click="createRoom">
				<span>创建群聊</span>
			</view>
		</view>
		<view class="large-btn">
			<view class="custom-icon icon-enter" @click="joinRoom">
				<span>加入群聊</span>
			</view>
		</view>
		<room-dialog ref="roomDialogRef"></room-dialog>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import roomDialog from './roomDialog.vue'
	import lottie from "../../components/lottie.vue";
	import lottieContent from '/static/assets/json/lottie-content.json';
	import { useAppStore } from '@/store/modules/app'
	import * as AQChatMSg from '@/common/sockets/protocol/AQChatMsgProtocol_pb';
	import AQSender from '@/common/sockets/AQSender'
	
	const roomDialogRef = ref(null)
	const appStore = useAppStore()
	const joinRoom = () => {
		if(appStore.roomInfo.roomId){
			uni.showModal({
				title: '系统提示',
				content: `当前已加入聊天房【${appStore.roomInfo.roomName}】,是否恢复`,
				confirmText: '恢复房间',
				cancelText: '退出不管',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url:"/pages/im/room"
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
		}else{
			roomDialogRef.value.show(false)
		}
	}
	const createRoom = () => {
		if(appStore.roomInfo.roomId){
			uni.showModal({
				title: '系统提示',
				content: `当前已加入聊天房【${appStore.roomInfo.roomName}】,是否恢复`,
				confirmText: '恢复房间',
				cancelText: '退出不管',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({
							url:"/pages/im/room"
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
		}else{
			roomDialogRef.value.show(true)
		}
		
	}
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
			color: #fff;

			uni-view {
				display: inline-block;
				font-size: calc((90vh - 54px) / 2 / 2 / 2) !important;
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
					left: calc((90vh - 54px) / 2 / 2 / 2 / 2 - 2px);
					bottom: 5px;
				}
			}
		}
		
		.lottie-content {
			height: 95% !important;
			position: absolute;
			top: 0;
			z-index: 0;
		}
	}
</style>