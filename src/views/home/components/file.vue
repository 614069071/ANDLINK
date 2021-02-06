<template>
	<li class="file-item-wrapper">
		<label class="file-check">
			<input type="checkbox" :value="model" />
		</label>

		<div class="file-info">
			<template v-if="model % 2">
				<div class="file-info-img">
					<img src="../../../assets/logo.png" alt="" />
				</div>

				<div class="file-info-main">
					<p class="file-info-title ellipsis">test.jpg</p>
					<p class="file-info-des"><span>4.08KB</span>2021-02-0417:34:50<span></span></p>
				</div>
			</template>

			<template v-else>
				<div class="file-info-img">
					<img src="../../../assets/folder.png" alt="" />
				</div>
				<div class="folder-info-main">
					<p class="folder-info-title ellipsis">test</p>
					<p class="folder-info-des">2021-02-0417:34:50</p>
				</div>
			</template>

		</div>

		<div class="file-control">删除</div>
	</li>
</template>

<script>
export default {
	name: 'file',
	props: ['model', 'value'],
	data() {
		return {};
	},
	methods: {
		change(model) {
			console.log(model, 'model');
			this.$emit('input:update', model);
		},
	},
};
</script>

<style scoped>
.file-item-wrapper {
	display: flex;
	height: 1.44rem;
	align-items: center;
	border-bottom: 1px solid rgba(151, 151, 151, 0.1);
}

.file-check {
	width: 0.64rem;
	height: 0.64rem;
	line-height: 0.64rem;
	text-align: center;
}

.file-info {
	display: flex;
	flex: 1;
}

.file-info-img {
	width: 1rem;
	height: 1rem;
	margin-right: 0.4rem;
}

.file-info-main {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.file-info-main .file-info-title,
.folder-info-main .folder-info-title {
	font-size: 0.32rem;
	flex: 1;
}

.file-info-main .file-info-des,
.folder-info-main .folder-info-des {
	color: #ccc;
}

.folder-info-main {
	flex: 1;
	display: flex;
	align-items: center;
	padding-right: 0.2rem;
	justify-content: space-between;
}

.file-control {
	width: 0.64rem;
	height: 0.64rem;
	line-height: 0.64rem;
	text-align: center;
	color: #bbb;
}
</style>