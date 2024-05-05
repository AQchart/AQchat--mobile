<template>
	<view class="chat-room">
		<view class="message-content">
			<render-msg v-for="(msg, index) in msgList" :key="index" :message="msg"
				:currentUser="appStore.userInfo"></render-msg>
		</view>
		<view class="message-input">
			<u-field placeholder="在此输入消息" v-model="msgStr">
				<template v-slot:right>
					<u-button type="success" @click="sendTextMsg" size="mini">发送</u-button>
					<u-icon @click="showOther" name="plus"></u-icon>
				</template>
			</u-field>
		</view>
		<view v-if="otherShow" class="message-other"></view>
	</view>
</template>

<script setup lang="ts">
	import renderMsg from './components/render-msg.vue'
	import { ref, onMounted, computed } from 'vue'
	import { useAppStore } from '../../store/modules/app'
	import useChart from './hook/useChat'
	const appStore = useAppStore()

	const {
		sendMessageFun,
		reciveMessageFun
	} = useChart()

	const otherShow = ref(false)

	const msgStr = ref('')

	const showOther = () => {
		otherShow.value = true
	}

	const msgList = computed(() => {
		return appStore.msgQueue
	})

	// 发送文本消息
	const sendTextMsg = () => {
		if (msgStr.value == '' || msgStr.value == null || !msgStr.value) {
			uni.showToast({
				title: '请输入消息',
				icon: 'exception'
			})
			return
		}
		sendMessage(0, msgStr.value)
	}

	// 组装和发送消息
	const sendMessage = (type : number, msg : string) => {
		const data = {
			roomId: appStore.roomInfo.roomId,
			msgType: type,
			msg: msg
		}
		sendMessageFun(data)
	}




	onMounted(() => {
		// 注册消息回调
		reciveMessageFun()
		uni.setNavigationBarTitle({
			title: appStore.roomInfo.roomName
		})
	})
</script>

<style lang="scss">
	.chat-room {
		position: relative;
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		background-color: #fccdfc;

		.message-content {
			position: absolute;
			left: 0px;
			top: 0px;
			padding: 5px 5px 0px 5px;
			overflow-y: auto;
			overflow-x: hidden;

			.message-item {}
		}

		.message-input {}

		.message-other {}
	}
</style>