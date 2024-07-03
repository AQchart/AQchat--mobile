<template>
	<u-navbar class="top-bar" :is-back="false" title="" :background="background">
		<u-row gutter="0" style="width: 100%;">
			<u-col span="3" style="text-align: center;">
				<view @click="leaveRoom"><u-icon name="arrow-left"></u-icon>离开</view>
			</u-col>
			<u-col span="6" @click="show = true" style="text-align: center; white-space: nowrap; overflow:hidden;text-overflow:ellipsis;">
				{{ appStore.roomInfo.roomName }}{{ appStore.roomInfo.roomNo == 0 ? '' : `(${appStore.roomInfo.roomNo})` }}
				<u-icon color="#409eff"
					name="account-fill"></u-icon>({{ appStore.memberList.length }})
			</u-col>
			<u-col span="3" style="text-align: center; color: red;">
				<view @click="logout"><u-icon custom-prefix="custom-icon" name=" icon-enter"></u-icon>
					退出</view>
			</u-col>
		</u-row>
	</u-navbar>
	<u-popup v-model="show" border-radius="10" style="overflow: hidden;" mode="center" closeable="true">
		<view class="member">
			<view class="title">房间成员<u-icon color="#409eff" @click="show = true"
					name="account-fill"></u-icon>({{ appStore.memberList.length }})</view>
			<scroll-view class="list" :style="{height: `${windowHeight/2-25}px`, marginTop: '25px'}" id="scrollview"
				scroll-y="true" :scroll-with-animation="true">
				<view class="mem" v-for="member in appStore.memberList" :key="member.userId">
					<u-row align="center" justify="space-between" gutter="0">
						<u-col text-align="center" :span="4">
							<img class="avatar" v-if="member.userId == 'AQChatHelper'" :src="member.userAvatar" alt="">
							<div style="margin-left: 28%;" class="avatar" v-else v-html="member.userAvatar"></div>
						</u-col>
						<u-col text-align="left" :span="8">
							<span class="name">{{ member.userName }}</span>
						</u-col>
					</u-row>
				</view>
			</scroll-view>
		</view>
	</u-popup>
</template>

<script lang="ts" setup>
	import { useAppStore } from '@/store/modules/app'
	import { ref, computed } from 'vue';
	import useRoom from '../hook/useRoom'
	const appStore = useAppStore()
	const show = ref(false)
	const windowHeight = computed(() => {
		let px = uni.getSystemInfoSync().windowHeight - 30;
		return px
	})

	const { leaveRoomFun, logoutFun } = useRoom()

	// 退出登录
	const logout = () => {
		logoutFun()
	}

	// 离开房间
	const leaveRoom = () => {
		leaveRoomFun()
	}

	const background = {
		backgroundColor: 'var(--chat-tab-bar-bg)'
	}
</script>

<style lang="scss" scoped>
	.top-bar {
		text-align: center;
		line-height: 44px;
		color: var(--txt-color);
		background-color: var(--bg-color);
	}

	.member {
		min-width: 500rpx;
		overflow: hidden;
		color: var(--txt-color);
		background-color: var(--bg-color);
		.title {
			position: relative;
			top: 5px;
			text-align: center;
			height: 25px;
			line-height: 25px;
		}

		.list {
			margin-top: 5px;

			.mem {
				padding: 2px;
				border-bottom: 1px solid #ececec;

				.avatar {
					width: 80rpx;
					height: 80rpx;
				}
			}
		}
	}
</style>