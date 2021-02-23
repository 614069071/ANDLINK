
<template>
	<div class="upload-view-wrapper">
		<header class="header-wrapper">
			<div class="header-left">
				<span class="header-back" @click="$router.back()">&lt;</span>
			</div>
			<div class="header-center">上传列表</div>
			<div class="header-right">
				<span @click="deleteAllHistory">清空列表</span>
			</div>
		</header>

		<main class="main-wrapper">
			<!-- 文件列表 -->
			<div class="upload-type-title">上传中 <span class="close" :class="{collpase:uploadVisible}" @click="uploadVisible = !uploadVisible">v</span></div>

			<div class="file-list-wrapper" v-show="uploadVisible">
				<ul>
					<li class="file-item-wrapper" v-for="(item,index) in uploadedList" :key="item.hash">
						<div class="file-info">
							<div class="file-info-img">
								<img src="../assets/other.png" alt="" />
							</div>

							<div class="file-info-main">
								<p class="file-info-title ellipsis">{{item.title}}</p>
								<p class="file-info-des">{{item.state ? '上传失败':'上传中...'}}</p>
							</div>

							<div class="file-control" @click="deleteUplaodedHistory(index)">删除</div>
						</div>
					</li>
				</ul>
			</div>

			<div class="upload-type-title">上传完成 <span class="close" :class="{collpase:downloadVisible}" @click="downloadVisible = !downloadVisible">v</span></div>

			<div class="file-list-wrapper" v-show="downloadVisible">
				<ul>
					<li class="file-item-wrapper" v-for="(item,index) in uploadList" :key="`${item.path}${Math.random()}`">
						<div class="file-info">
							<div class="file-info-img">
								<img :src="item | dePath" alt="" />
							</div>

							<div class="file-info-main">
								<p class="file-info-title ellipsis">{{item.path.split('/').pop()}}</p>
								<p class="file-info-des file"><span>{{(item.size / 1024) | toBety}}</span>{{item.time}}<span></span></p>
							</div>

							<div class="file-control" @click="deleteHistory(index)">删除</div>
						</div>
					</li>
				</ul>
			</div>

		</main>
	</div>
</template>

<script>
import utils from '../utils';

export default {
	name: 'upload-list',
	data() {
		return {
			uploadVisible: true,
			downloadVisible: true,
			uploadList: [],
			uploadedList: [],
		};
	},
	watch: {
		$route: {
			handler() {
				this.updateUploadCache();
				console.log('$route');
			},
			immediate: true,
		},
	},
	mounted() {
		this.$bus.$on('uploadCache', () => {
			// 更新列表
			this.updateUploadCache();
		});
	},
	methods: {
		updateUploadCache() {
			const uploadedCache = utils.storage.get('uploadedCache') || [];
			const uploadCacheList = utils.storage.get('uploadCacheList') || [];
			this.uploadedList = uploadedCache;
			this.uploadList = uploadCacheList;
		},
		deleteAllHistory() {
			utils.storage.set('uploadCacheList', []);
			utils.storage.set('uploadedCache', []);
			this.uploadList = [];
			this.uploadedList = [];
		},
		deleteUplaodedHistory(i) {
			const uploadedCache = utils.storage.get('uploadedCache') || [];
			uploadedCache.splice(i, 1);
			utils.storage.set('uploadedCache', uploadedCache);
			this.uploadedList = uploadedCache;
		},
		deleteHistory(i) {
			const uploadCacheList = utils.storage.get('uploadCacheList') || [];
			uploadCacheList.splice(i, 1);
			utils.storage.set('uploadCacheList', uploadCacheList);
			this.uploadList = uploadCacheList;
		},
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
	text-align: center;
	/* background-color: red; */
}

.close.collpase {
	transform: rotate(180deg);
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
	overflow: hidden;
}

.file-info-img {
	width: 1rem;
	height: 1rem;
	margin-right: 0.4rem;
}

.file-info-main {
	display: flex;
	flex: 1;
	overflow: hidden;
	flex-direction: column;
	justify-content: space-between;
	/* background-color: pink; */
}

.file-info-main .file-info-title,
.folder-info-main .folder-info-title {
	font-size: 0.32rem;
	flex: 1;
}

.file-info-des.file {
	display: flex;
	justify-content: space-between;
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
	width: 1rem;
	height: 1rem;
	line-height: 1rem;
	text-align: center;
	color: #bbb;
	white-space: nowrap;
}
</style>