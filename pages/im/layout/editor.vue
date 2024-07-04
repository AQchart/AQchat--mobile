<template>
	<checkbox-group v-if="showAtUser" class="img-check-group" @change="handleSelect">
		<checkbox class="img-checkbox" v-for="member in userList" :value="member.userId"
			:name="member.userName" :key="member.userId">
			<view class="img-box" :class="atActive(member.userId) ? 'img-cheched': ''">
				<img class="avatar" :src="member.userAvatar" alt="">
			</view>
			<span class="name">{{ member.userName }}</span>
		</checkbox>
	</checkbox-group>
	<view class="im-container">
		<view class="editor">
			<editor id="im-editor" ref="inputRef" class="im-editor im-blank" :placeholder="placeholder"
				@statuschange="onInput" @input="onInput" @focus="onFocus" :read-only="appStore.editorDisabled"
				@ready="initEditor">
			</editor>
		</view>
	</view>

</template>

<script lang="ts" setup>
	import {
		ref,
		watch,
		onMounted,
		defineExpose,
		defineEmits
	} from 'vue'
	import { useAppStore } from '@/store/modules/app'
	const appStore = useAppStore()

	const props = defineProps({
		placeholder: String
	})

	const { placeholder } = props

	// 显示艾特信息
	const showAtUser = ref(false)
	/**
	 * 输入框el
	 */
	const inputRef = ref()

	/**
	 * html内容
	 */
	const htmlContent = ref('')

	/**
	 * 纯文本内容
	 */
	const textContent = ref('')

	const userList = ref([])

	/**
	 * emit事件
	 */
	const emit = defineEmits(['input', 'focus'])

	// 编辑器实例
	const editorCtx = ref()

	// 艾特的列表
	const atList = ref([])

	const deltaList = ref([])

	const initUserList = () => {
		userList.value = appStore.memberList.filter((x: any)=>x.userId != appStore.userInfo.userId).map(x => {
			return {
				userId: x.userId,
				userName: x.userName,
				userAvatar: x.userAvatar.indexOf('png') != -1 ? x.userAvatar : svgToDataURL(x.userAvatar)
			}
		})
	}

	const svgToDataURL = (html : any) => {
		const toolElm = document.createElement('div')
		toolElm.innerHTML = html
		const svgElement = toolElm.firstChild
		if (!svgElement) return null
		return 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svgElement))
	}

	const initEditor = () => {
		// #ifdef APP-PLUS || MP-WEIXIN || H5
		uni.createSelectorQuery().select('#im-editor').context((res : any) => {
			editorCtx.value = res.context
			editorCtx.value.setContents({
				html: '<p><br></p>'
			})
		}).exec()
		// #endif
	}
	
	// 更新消息列表
	watch(() => appStore.memberList, (newV:any) => {
	  let memberList = newV.filter((x: any)=>x.userId != appStore.userInfo.userId);
	  if(memberList.length > 0){
	    initUserList();
	  }
	}, { immediate:true,deep: true })

	onMounted(() => {
		initEditor()
		console.log(appStore.memberList)
	})

	/**
	 * 输入事件
	 */
	const onInput = () => {
		if (editorCtx.value) {
			getContents()
			asyncAtList()
			emit('input', htmlContent.value == '<p><br></p>' ? '' : htmlContent.value)
		}
	}

	// 获取艾特列表
	const getAtList = () => {
		return atList.value.map((it : string) => '@' + it).join(',')
	}

	const getCallUserList = () => {
		return appStore.memberList.filter(it => atList.value.includes(it.userId))
	}
	// 艾特勾选 
	const atActive = (userId : string) => {
		return atList.value.indexOf(userId) > -1
	}

	// 显示艾特功能栏
	const showAt = () => {
		showAtUser.value = !showAtUser.value
	}
	
	const getText = () => {
		return textContent.value
	}

	// 艾特占位符
	const DEFAULT_AT = "#####AQChat####"

	// 选择艾特的人
	const handleSelect = (event : any) => {
		// 去除之前艾特过，取消艾特的人
		deltaList.value.forEach((item : any) => {
			if (item.attributes && item.attributes.link) {
				let userId = item.attributes.link.replace('#', '')
				if (!event.detail.value.includes(userId)) {
					item.insert = ''
					item.attributes = {}
				}
			}
		})
		atList.value = [...event.detail.value]
		atList.value.forEach((ele : any) => {
			let arr : any[] = []
			const user = appStore.memberList.find(it => it.userId == ele)
			let atUsers = deltaList.value.filter((it : any) => it.attributes && it.attributes.link).map((it : any) => it.attributes.link.replace('#', ''))
			// 艾特过的不处理
			if (atUsers.includes(user?.userId)) {
				return;
			}
			editorCtx.value.insertText({
				text: DEFAULT_AT
			})
			// 分割艾特
			for (let i = 0; i < deltaList.value.length; i++) {
				let item = deltaList.value[i];
				let isNext = item.insert.indexOf(DEFAULT_AT);
				if (isNext > -1) {
					let [textPrefix, textSuffix] = item.insert.split(DEFAULT_AT);
					if (textPrefix == '') {
						arr.push({ insert: DEFAULT_AT })
					} else if (textPrefix.indexOf('@') != -1) {
						arr.push({ attributes: item.attributes, insert: textPrefix })
					} else {
						arr.push({ insert: textPrefix })
					}
					if (textSuffix == '') {
						arr.push({ insert: DEFAULT_AT })
					} else if (textSuffix.indexOf('@') != -1) {
						arr.push({ attributes: item.attributes, insert: textSuffix })
					} else {
						arr.push({ insert: textSuffix })
					}
				}
				else {
					arr.push(item);
				}
			}
			// 替换艾特
			for (let i = 0; i < arr.length; i++) {
				let item = arr[i];
				let isNext = item.insert.indexOf(DEFAULT_AT);
				if (isNext > -1) {
					let newObj = {
						attributes: {
							link: `#${user?.userId}`,
							textDecoration: 'none',
							color: '#409eff', class: 'at-class',
						},
						insert: '@' + user?.userName
					}
					arr[i] = newObj
				}
			}
			deltaList.value = [...arr]
		})
		setContents()
	}

	// this
	const getContents = () => {
		editorCtx.value && editorCtx.value.getContents({
			success: function (data : any) {
				deltaList.value = data.delta.ops
				htmlContent.value = data.html
				textContent.value = data.text
			}
		})
	}

	// 同步艾特
	const asyncAtList = () => {
		atList.value = deltaList.value.filter((it : any) => it.attributes && it.attributes.link).map((it : any) => it.attributes.link.replace('#', ''))
	}

	const setContents = () => {
		editorCtx.value && editorCtx.value.setContents({
			delta: { ops: deltaList.value }
		})
	}

	const onFocus = (event : any) => {
		getContents()
		emit('focus', event)
	}

	/**
	 * 插入表情图片
	 */
	const insertImage = (obj : any) => {
		if (editorCtx.value) {
			editorCtx.value.insertImage({
				...obj,
				extClass: 'emo-image'
			})
		}
	}

	/**
	 * 重新编辑
	 */
	const rewriteFun = (content : string) => {
		if (editorCtx.value) {
			editorCtx.value.setContents({
				html: content
			})
		}
	}

	/**
	 * 清空输入框内容
	 */
	const clear = () => {
		if (editorCtx.value) {
			atList.value = []
			showAtUser.value = false
			textContent.value = ''
			editorCtx.value.clear()
		}
	}

	/**
	 * 向外暴露函数
	 */
	defineExpose({
		insertImage,
		clear,
		rewriteFun,
		getAtList,
		showAt,
		getCallUserList,
		getText
	})
</script>

<style lang="scss" scoped>
	.im-container {
		width: 450rpx;
		height: auto;
		min-height: 75rpx;
		max-height: 500rpx;
		background: var(--input-inner-bg);
		border-radius: 8rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		color: var(--input-text-color);
		line-height: 43rpx;
		padding: 5rpx 8rpx;
		box-shadow: rgba(50, 50, 93, 0.1) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.1) 0px 18px 36px -18px inset;

		.editor {
			margin: 2px;
			display: block;
			position: relative;
			box-sizing: border-box;
			user-select: text;
			outline: none;
			overflow: hidden;
			width: 100%;
		}

		::v-deep .emo-image {
			height: 40rpx;
			width: 40rpx;
			vertical-align: middle;
			display: inline-block;
		}

		.im-editor {
			box-sizing: border-box;
			outline: none;
			height: 100%;
			max-height: 450rpx;
			min-height: 37px;
			overflow-y: auto;
			tab-size: 4;
			-moz-tab-size: 4;
			text-align: left;
			white-space: pre-wrap;
			word-wrap: break-word;

			.placeholder {

				&::after {
					color: rgba(0, 0, 0, .6);
					content: attr(placeholder);
					font-style: italic;
					pointer-events: none;
				}
			}
		}

		.im-editor .im-blank {
			position: relative;
			font-size: inherit;
			line-height: inherit;
			font-family: inherit;
			min-height: inherit;
			width: 100%;
			height: 100%;
			padding: 0;
			overflow-x: hidden;
			overflow-y: auto;
			-webkit-tap-highlight-color: transparent;
			-webkit-touch-callout: none;
			-webkit-overflow-scrolling: touch;
		}
	}

	.img-check-group {
		background-color: #e1e1e1;
		width: 135%;
		overflow-x: auto;
		overflow-y: hidden;
		border-radius: 5px;
		margin-bottom: 5rpx;

		.img-checkbox {
			margin: 10rpx;

			::v-deep .uni-checkbox-input {
				display: none;
			}

			::v-deep .uni-checkbox-wrapper {
				display: flex;
				flex-direction: column;
			}

			height: 100rpx;
			width: 82rpx;

			.img-box {
				.avatar {
					width: 80rpx;
					height: 80rpx;
				}
			}

			.img-cheched {
				position: relative;

				&:before {
					content: '';
					width: 80rpx;
					height: 80rpx;
					position: absolute;
					border-radius: 50rpx;
					background-color: rgba(0, 0, 0, .3);
				}

				&:after {
					width: 30rpx;
					height: 30rpx;
					text-align: center;
					position: absolute;
					background-color: red;
					right: -10rpx;
					top: 50rpx;
					line-height: 30rpx;
					font: normal normal normal 25rpx / 1 "uicon-iconfont";
					content: "\e6a8";
					color: #fff;
					border: 2px solid #fff;
					border-radius: 50rpx;
				}
			}

			.name {
				font-size: 11px;
			}
		}
	}
</style>