<template>
	<view class="editor">
		<div class="im-editor im-blank" @input="inputText" @focus="inputFocus" ref="inputRef" contenteditable :placeholder="placeholder">
		</div>
	</view>
</template>

<script lang="ts" setup>
	import { ref, defineProps, defineExpose, defineEmits } from 'vue'
	/**
	 * placeholder 输入提示文字
	 */
	const props = defineProps(['placeholder'])
	const { placeholder } = props
	
	/**
	 * 输入框el
	 */
	const inputRef = ref(null)

	/**
	 * emit事件
	 * input 输入文字事件
	 * focus 点击输入框事件
	 */
	const emits = defineEmits(['input','focus'])

	/**
	 * 获取输入框的值
	 */
	const getInnerHtml = () => {
		return inputRef.value.innerHTML;
	}

	/**
	 * 设置输入框的值
	 */
	const setInnerHtml = (html : any) => {
		inputRef.value.innerHTML = html
	}
	
	/**
	 * 编辑器input事件
	 */
	const inputText = (e : any) => {
		inputChange(inputRef.value == null ? "" : inputRef.value.innerHTML)
	}

	/**
	 * 回调输入事件返回输入的值 使用v-model接收
	 */
	const inputChange = (html : any) => {
		emits('input', html)
	}
	
	/**
	 * 聚焦事件
	 */
	const inputFocus = () => {
		emits('focus')
	}

	/**
	 * 插入表情图片
	 */
	const insertImage = (obj : any) => {
		let img = `<img src="${obj.src}" alt="${obj.alt}" class='emo-image' />`
		let html = getInnerHtml() + img
		setInnerHtml(html)
		inputChange(getInnerHtml())
	}
	
	/**
	 * 重新编辑
	 */
	const rewriteFun = (content:string)=>{
		inputRef.value.innerHTML += content
	}

	/**
	 * 清空输入框内容
	 */
	const clear = () => {
		setInnerHtml('')
	}

	/**
	 * 向外暴露函数
	 */
	defineExpose({
		insertImage,
		clear,
		rewriteFun
	})
</script>

<style lang="scss" scoped>
	.editor {
		margin: 2px;
		display: block;
		position: relative;
		box-sizing: border-box;
		user-select: text;
		outline: none;
		overflow: hidden;
		width: 100%;
		height: 60px;
		min-height: 60px;
	}
	
	::v-deep .emo-image{
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

		&:empty {
			&::before {
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
</style>