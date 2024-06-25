<template>
	<u-popup class="popup-custom" v-model="showPopup" mode="bottom" :mask-close-able="false" height="50%" closeable>
		<u-form class="form" :model="roomForm" ref="formDataRef" label-width="70px">
			<u-form-item label="房间号" prop="roomNo">
				<u-input class="input" v-model="roomForm.roomNo" placeholder="请输入房间号" />
			</u-form-item>
			<u-form-item v-if="created" label="房间名" prop="roomName">
				<u-input class="input" v-model="roomForm.roomName" placeholder="请输入房间名称" />
			</u-form-item>
			<u-form-item v-if="created" prop="ai" label-width="170px" label="是否开启AI助手">
				<u-switch v-model="roomForm.ai" :active-value="1" :inactive-value="0" active-color="#409eff"
					inactive-color="#e6effb"></u-switch>
			</u-form-item>
			<u-form-item v-if="created" prop="history" label-width="170px" label="是否支持查看历史消息">
				<u-switch v-model="roomForm.history" :active-value="1" :inactive-value="0" active-color="#409eff"
					inactive-color="#e6effb"></u-switch>
			</u-form-item>
		</u-form>
		<u-button class="submit-btn" type="primary" @click="submit">{{ created ? '创建': '加入' }}</u-button>
	</u-popup>
</template>

<script setup lang="ts">
	import { ref, defineExpose, nextTick } from 'vue';
	import useRoom from '../hook/useRoom'
	const created = ref(false);
	const showPopup = ref(false);
	const formDataRef = ref();

	const {
		roomForm,
		reloadLoading,
		joinRoomFun,
		createRoomFun
	} = useRoom()
	
	// 校验规则
	const rules = {
		roomName: [{ required: true, message: '请输入房间名', trigger: ['change', 'blur'] },
		{ min: 4, max: 10, message: '房间名长度为4-10字符' }],
		roomNo: [{ required: true, message: '请输入房间号', trigger: ['change', 'blur'] },
		{

			pattern: /^[0-9]*$/g, transform(value : any) {
				return String(value);
			}, message: "请输入4-10数字", trigger: ['change', 'blur']

		},
		{ min: 4, max: 10, message: '房间号长度为4-10数字', trigger: ['change', 'blur'] }]
	}
	
	// 显示输入框
	const show = (create : boolean) => {
		created.value = create
		showPopup.value = true
		roomForm.roomName = ''
		roomForm.roomNo = null
		roomForm.history = 1
		roomForm.ai = 0
		nextTick(() => {
			if (formDataRef.value) {
				formDataRef.value.setRules(rules)
			}
		})
	};
	
	// 隐藏输入框
	const hide = () => {
		showPopup.value = false
	};

	// 提交
	const submit = () => {
		formDataRef.value.validate((valid : any) => {
			if (valid && created.value) {
				createRoomFun()
				hide()
			} else if (valid && !created.value) {
				joinRoomFun()
				hide()
			}
		})
	}

	defineExpose({
		show,
		hide
	})
</script>

<style lang="scss" scoped>
	.popup-custom {
		::v-deep .u-drawer-content {
			border-top-right-radius: 10px;
			border-top-left-radius: 10px;
		}
	}

	.submit-btn {
		margin: 10px 25% 0px 25%;
	}

	.form {
		padding: 50px 30px 20px 30px;

		.input {
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
	}
</style>