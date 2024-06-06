<template>
	<u-popup class="popup-custom" v-model="showPopup" mode="bottom" :mask-close-able="false" height="50%" closeable>
		<u-form class="form" :model="roomForm" ref="formDataRef" label-width="70px">
			<u-form-item v-if="created" label="房间名" prop="groupName">
				<u-input class="input" v-model="roomForm.roomName" placeholder="请输入房间名称" />
			</u-form-item>
			<u-form-item label="房间号" prop="groupId">
				<u-input class="input" v-model="roomForm.roomNo" placeholder="请输入房间号" />
			</u-form-item>
		</u-form>
		<u-button class="submit-btn" type="primary" @click="submit">{{ created ? '创建': '加入' }}</u-button>
	</u-popup>
</template>

<script setup lang="ts">
	import { ref, reactive, defineExpose, nextTick } from 'vue';
	import useRoom from '../hook/useRoom'
	const created = ref(false);
	const showPopup = ref(false);
	const formDataRef = ref(null);


	const {
		roomForm,
		reloadLoading,
		joinRoomFun,
		createRoomFun
	} = useRoom()
	const rules = reactive({
		roomName: [{ required: true, message: '请输入房间名', trigger: ['change', 'blur'] },
		{ min: 1, max: 10, message: '房间名长度为1-10字符' }],
		roomNo: [{ required: true, message: '请输入房间号', trigger: ['change', 'blur'] },
		{ pattern: /[1-9]\d*/, message: "请输入数字", trigger: ['change', 'blur'] },
		{ min: 1, max: 10, message: '房间号长度为1-10字符', trigger: ['change', 'blur'] }]
	});

	const show = (create : boolean) => {
		created.value = create
		showPopup.value = true
		roomForm.roomName = ''
		roomForm.roomNo = null
		nextTick(() => {
			formDataRef.value.setRules(rules)
		})
	};

	const hide = () => {
		showPopup.value = false
	};

	const submit = () => {
		formDataRef.value.validate((valid : boolean) => {
			if (valid && created.value) {
				console.log("created")
				createRoomFun()
				hide()
			} else if (valid && !created.value) {
				console.log("join")
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
			border-top-right-radius: 20px;
			border-top-left-radius: 20px;
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