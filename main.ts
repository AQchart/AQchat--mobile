import App from './App'

// 引入 uView UI
import uView from './uni_modules/vk-uview-ui';
// 引入store
import store from './store'

import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App)

	// 使用 uView UI
	app.use(uView)
	app.use(store)
	return {
		app
	}
}