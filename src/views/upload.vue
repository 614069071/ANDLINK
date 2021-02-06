
<template>
	<div class="upload-view-wrapper">
		<header class="header-wrapper">
			<div class="header-left">
				<span class="header-back" @click="$router.back()">&lt;</span>
			</div>
			<div class="header-center">上传列表</div>
			<div class="header-right"></div>
		</header>

		<main class="main-wrapper">
			<div class="crumbs-wrapper">全部磁盘>sda1</div>

			<!-- 文件列表 -->
			<div class="upload-type-title">上传中 <span class="close" @click="uploadVisible = !uploadVisible">v</span></div>

			<div class="file-list-wrapper" v-show="uploadVisible">
				<ul>
					<li class="file-item-wrapper" v-for="item in 6" :key="item">
						<div class="file-info">
							<div class="file-info-img">
								<img src="../assets/logo.png" alt="" />
							</div>

							<div class="file-info-main">
								<p class="file-info-title ellipsis">test.jpg</p>
								<p class="file-info-des"><span>4.08KB</span>2021-02-0417:34:50<span></span></p>
							</div>
						</div>
					</li>
				</ul>
			</div>

			<div class="upload-type-title">上传完成 <span class="close" @click="downloadVisible = !downloadVisible">v</span></div>

			<div class="file-list-wrapper" v-show="downloadVisible">
				<ul>
					<li class="file-item-wrapper" v-for="item in 3" :key="item">
						<div class="file-info">
							<div class="file-info-img">
								<img src="../assets/logo.png" alt="" />
							</div>

							<div class="file-info-main">
								<p class="file-info-title ellipsis">test.jpg</p>
								<p class="file-info-des"><span>4.08KB</span>2021-02-0417:34:50<span></span></p>
							</div>
						</div>
					</li>
				</ul>
			</div>

		</main>
	</div>
</template>

<script>
export default {
	name: 'upload-list',
	data() {
		return {
			uploadVisible: true,
			downloadVisible: true,
		};
	},
};
</script>

<style scoped>
.header-wrapper {
	height: 0.8rem;
	line-height: 0.8rem;
	background-color: #30c0b1;
	display: flex;
	justify-content: space-between;
	color: #fff;
	padding: 0 0.2rem;
}

.crumbs-wrapper {
	height: 1rem;
	display: flex;
	padding: 0 0.4rem;
	align-items: center;
	background-color: #f9f9f9;
	color: #999;
}

.header-left,
.header-right {
	width: 1.6rem;
	display: flex;
	align-items: center;
}

.header-left .header-back {
	width: 0.4rem;
	height: 0.4rem;
	line-height: 0.4rem;
	font-size: 0.38rem;
	text-align: center;
}

.header-left .header-device {
	flex: 1;
}

.header-right {
	justify-content: flex-end;
}

.header-center {
	flex: 1;
	text-align: center;
}

.upload-type-title {
	height: 0.8rem;
	line-height: 0.8rem;
	padding: 0 0.4rem;
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #eee;
	margin-top: 0.4rem;
}

.upload-type-title .close {
	width: 0.6rem;
	height: 0.6rem;
	line-height: 0.6rem;
	text-align: right;
	/* background-color: red; */
}

.file-list-wrapper {
	padding: 0 0.4rem;
}

.main-wrapper {
	flex: 1;
	overflow-x: hidden;
	overflow-y: scroll;
}

.footer-wrapper {
	height: 0.8rem;
	line-height: 0.8rem;
	background-color: #aaa;
	display: flex;
	justify-content: space-between;
	color: #fff;
	padding: 0 0.2rem;
}

/* 文件列表 */
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