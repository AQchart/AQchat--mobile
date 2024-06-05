<template>
	<view class="editor">
		<div class="im-editor im-blank" @input="inputText" @focus="inputFocus" ref="inputRef" contenteditable :placeholder="placeholder">
		</div>
	</view>
</template>

<script lang="ts" setup>
	import { ref, defineProps, defineExpose, defineEmits } from 'vue'
	const props = defineProps(['placeholder'])
	const { placeholder } = props

	const inputRef = ref(null)

	const emits = defineEmits(['input'])

	const getInnerHtml = () => {
		return inputRef.value.innerHTML;
	}

	const setInnerHtml = (html : any) => {
		inputRef.value.innerHTML = html
	}

	const inputText = (e : any) => {
		inputChange(inputRef.value == null ? "" : inputRef.value.innerHTML)
	}

	const inputChange = (html : any) => {
		emits('input', html)
	}
	
	const inputFocus = () => {
		emits('focus')
	}

	const insertImage = (obj : any) => {
		let img = `<img src="${obj.src}" alt="${obj.alt}" class='emo-image' />`
		let html = getInnerHtml() + img
		setInnerHtml(html)
		inputChange(getInnerHtml())
	}

	const clear = () => {
		setInnerHtml('')
	}

	defineExpose({
		insertImage,
		clear
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