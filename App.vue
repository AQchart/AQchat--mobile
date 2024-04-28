<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import './assets/style/theme.scss';
	@import './assets/style/animation.scss';

	/*每个页面公共css */
	#app {
		background-color: var(--bg-color);
		color: var(--txt-color);
	}
</style>