<template>
	<view class="user-info">
		<u-row class="user-avatar-row" align="center" justify="center">
			<view class="user-avatar" v-html="userForm.userAvatar"></view>
		</u-row>
		<u-row class="user-name">
			<u-col span="2"></u-col>
			<u-col span="6">
				<u-form :model="userForm" ref="uformRef" style="line-height: 60px;">
					<u-form-item label-width="0px" prop="userName">
						<u-input class="user-name-input" v-model="userForm.userName" maxlength="10" clearable
							placeholder="起一个好听的名字吧" />
					</u-form-item>
				</u-form>
			</u-col>
			<u-col span="2" class="btn-reload-col">
				<lottie class="btn-reload" v-if="reloadLoading" :loop="false" :autoplay="true" :src="LottieReload"
					@click.native="reloadFun" />
			</u-col>
		</u-row>
		<u-row class="start-btn">
			<button class="login" @click="enterChatFun">
				进入聊天室
				<svg fill="currentColor" viewBox="0 0 24 24" class="icon">
					<path clip-rule="evenodd"
						d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
						fill-rule="evenodd"></path>
				</svg>
			</button>
		</u-row>
	</view>
</template>

<script setup lang="ts">
	import useStart from "../hook/useStart"
	import lottie from '../components/lottie.vue'
	import LottieReload from "/assets/json/lottie-reload.json";
	import { ref, onMounted } from 'vue'
	const uformRef = ref(null)
	const {
		step,
		userForm,
		reloadLoading,
		toStartFun,
		reloadFun
	} = useStart()

	const rules = {
		userName: [{
			required: true,
			message: '请输入昵称',
			trigger: ['change', 'blur']
		}, {
			min: 1,
			max: 10
		}]
	}

	const enterChatFun = () => {
		uformRef.value.validate(vaild => {
			if (vaild) {
				// TODO 进入聊天室
			}
		})
	}

	onMounted(() => {
		uformRef.value.setRules(rules);
	})
</script>

<style lang="scss">
	.user-info {
		width: 100%;
		margin-top: 30%;

		.user-avatar-row {
			.user-avatar {
				width: 100px;
				height: 100px;
			}
		}

		.user-name {
			margin-top: 20px;
			.user-name-input {
				outline: none;
				border: none;
				height: 100%;
				border-radius: 17px;
				background: #ffffff;
				box-shadow: inset 6px 6px 8px #cfcfcf,
					inset -6px -6px 8px #ffffff;
				padding: 0 10px;

				::v-deep .uni-input-input {
					text-align: center;
				}
				::v-deep .uni-input-placeholder {
					text-align: center;
				}
			}

			.btn-reload-col {
				width: 40px;
				height: 40px;
			}
		}

		.start-btn {
			margin-top: 40px;
			width: 100%;

			.login {
				transition: all 0.3s ease-in-out;
				box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
				padding-block: 0.5rem;
				padding-inline: 1.25rem;
				background-color: rgb(0 107 179);
				border-radius: 9999px;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				color: #ffff;
				gap: 10px;
				font-weight: bold;
				border: 3px solid #ffffff4d;
				outline: none;
				overflow: hidden;
				font-size: 15px;
				bottom: 0;
				right: 0;

				&:hover {
					transform: scale(1.05);
					border-color: #fff9;
				}

				&:hover .icon {
					transform: translate(4px);
				}

				&:hover::before {
					animation: shine 1.5s ease-out infinite;
				}

				&::before {
					content: "";
					position: absolute;
					width: 100px;
					height: 100%;
					background-image: linear-gradient(120deg,
							rgba(255, 255, 255, 0) 30%,
							rgba(255, 255, 255, 0.8),
							rgba(255, 255, 255, 0) 70%);
					top: 0;
					left: -100px;
					opacity: 0.6;
				}

				.icon {
					width: 24px;
					height: 24px;
					transition: all 0.3s ease-in-out;
				}
			}

			.login-fail {
				cursor: not-allowed;
				background-color: #ccc;
			}
		}
	}
</style>