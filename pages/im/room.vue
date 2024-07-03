<template>
	<chatContent v-if="appStore.roomType == 0"></chatContent>
	<aiContent v-else></aiContent>
</template>
<script setup lang="ts">
import chatContent from './chat.vue'
import aiContent from './ai.vue'
import { useAppStore } from '@/store/modules/app'
import { onMounted } from 'vue'
const appStore = useAppStore()

onMounted(() => {
	console.log(appStore.roomType)
})

</script>