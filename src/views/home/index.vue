<template>
	<div class="home-view-wrapper">
		<header class="header-wrapper">
			<div class="header-left">
				<div class="header-device ellipsis">{{deviceName}}</div>
			</div>
			<div class="header-center">我的云盘</div>
			<div class="header-right">
				<div v-show="isData">
					<label><input type="file" hidden @change="uploadFile($event)" />上传</label>
					<span @click="createVisible = true">新建</span>
				</div>
			</div>
		</header>

		<main class="main-wrapper">
			<div class="crumbs-wrapper">
				<span v-for="(item,index) in breadcrumbList" :key="index" @click="crumbsChange(item,index)">{{index ? '>' :''}}{{item.name.split('/').pop()}}</span>
			</div>

			<!-- 文件列表 -->
			<div class="file-list-wrapper">
				<template v-for="item in filelist">
					<!-- 文件夹 -->
					<template v-if="item.is_dir">
						<div class="file-item-wrapper" :key="`${item.create_time}` + Math.random()">
							<label class="file-check">
								<input type="checkbox" :value="item" v-model="checklist" />
							</label>

							<div class="file-info" @click="folderClick(item)">
								<div class="file-info-img">
									<img src="../../assets/folder.png" alt="" />
								</div>
								<div class="folder-info-main">
									<p class="folder-info-title ellipsis">{{item.path.split('/').pop()}}</p>
									<p class="folder-info-des">{{item.name}}</p>
								</div>
							</div>

							<div class="file-control" @click="renameFolderClick(item)">重命名</div>
						</div>
					</template>

					<!-- 磁盘 -->
					<template v-else-if="item.type === 'usb' || item.type === 'data'">
						<div class="file-item-wrapper" :key="`${item.create_time}` + Math.random()" @click="folderClick(item)">
							<div class="file-info-img">
								<img src="../../assets/disk.png" alt="">
							</div>
							<div class="file-info-main">
								<p class="folder-info-title ellipsis">{{item.name}}</p>
								<!-- 文件返回是kbety -->
								<p class="folder-info-des">{{(item.total_space - item.free_space) | toBety}}/{{item.total_space | toBety}}</p>
							</div>
						</div>
					</template>

					<!-- 文件 -->
					<template v-else>
						<div class="file-item-wrapper" :key="`${item.create_time}` + Math.random()">
							<label class="file-check">
								<input type="checkbox" :value="item" v-model="checklist" />
							</label>

							<div class="file-info">
								<div class="file-info-img">
									<img :src="item | dePath" alt="" />
								</div>

								<div class="file-info-main">
									<p class="file-info-title ellipsis"><a :href="item | deUploadSrc" download>{{item.path.split('/').pop()}}</a></p>
									<!-- 文件返回是bety -->
									<p class="file-info-des file"><span>{{(item.bytes / 1024) | toBety}}</span>{{item.update_time | formatTime}}<span></span></p>
								</div>
							</div>
							<div class="file-control" @click="renameFolderClick(item)">重命名</div>
						</div>
					</template>

				</template>
			</div>

			<div class="node-data-wrapper" v-show="!filelist.length">
				暂无数据
			</div>
		</main>

		<footer class="footer-wrapper" v-show="isData">
			<span @click="deleteBranchClick">删除</span>
			<!-- <span @click="downloadFiles">下载</span> -->
			<span @click="$router.push('/upload')">任务</span>
		</footer>

		<!-- 创建文件夹 -->
		<div class="dialog-wrapper" @click.stop v-show="createVisible">
			<div class="dialog-inner-wrapper">
				<p>创建文件夹</p>
				<div class="dialog-inner-main">
					<input type="text" v-model="createFolderVal" placeholder="请输入文件夹名字">
				</div>
				<div class="dialog-inner-btns">
					<button class="create-cancel" @click="createFolderCancel">取消</button>
					<button class="create-submit" @click="createFolderSubmit">确定</button>
				</div>
			</div>
		</div>

		<!-- 重命名 -->
		<div class="dialog-wrapper" @click.stop v-show="renameVisible">
			<div class="dialog-inner-wrapper">
				<p>重命名</p>
				<div class="dialog-inner-main">
					<input type="text" v-model="renameFolderVal" placeholder="请输入名字">
				</div>
				<div class="dialog-inner-btns">
					<button class="create-cancel" @click="renameFolderCancel">取消</button>
					<button class="create-submit" @click="renameFolderSubmit">确定</button>
				</div>
			</div>
		</div>

		<!-- 删除 -->
		<div class="dialog-wrapper" @click.stop v-show="deleteVisible">
			<div class="dialog-inner-wrapper">
				<p>删除</p>
				<div class="dialog-inner-main">
					<div>确定要删除吗？</div>
				</div>
				<div class="dialog-inner-btns">
					<button class="create-cancel" @click="deleteFolderCancel">取消</button>
					<button class="create-submit" @click="deleteFolderSubmit">确定</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import '../../utils/hejia1.5.0';
import utils from '../../utils';

// console.log('window.Hejia.ready', window.Hejia.ready);

export default {
	name: 'Home',
	data() {
		return {
			deviceName: '...',
			isData: false,
			checklist: [],
			filelist: [],
			breadcrumbList: [{ uuid: '', name: '全部磁盘', path: '' }],
			createVisible: false,
			createFolderVal: '',
			renameVisible: false,
			renameFolderVal: '',
			renameItem: {},
			deleteVisible: false,
			deleteList: [],
		};
	},
	created() {
		if (process.env.NODE_ENV === 'development') {
			// 测试账号
			const phone = '19865765350'; //13798468449 18927472679 15367239907 19865765350
			const pinCode = '33333333333'; //99999999999 22222222222 44444444444 33333333333 20210209021
			this.getDeviceInfo(pinCode, phone);
		} else {
			this.hejiaReady((phone, pinCode) => {
				this.getDeviceInfo(pinCode, phone);
			});
		}

		// console.log(window.Hejia, 'Hejia sdk');
	},
	mounted() {
		console.log('mounted');
	},
	methods: {
		addUplaodedCache(title, hash, state = 0) {
			// 添加上传中 state 0 上传中 1 上传失败
			const uploadedCache = utils.storage.get('uploadedCache') || [];
			const uploadedCacheItem = { title, hash, state };
			const isExist = uploadedCache.some((e, i) => {
				if (e.hash === hash) {
					uploadedCache.splice(i, uploadedCacheItem);
				}
			});

			!isExist && uploadedCache.unshift(uploadedCacheItem);
			utils.storage.set('uploadedCache', uploadedCache);

			this.$bus.$emit('uploadCache');
		},
		delUplaodedCache(hash) {
			// 删除上传中
			const uploadedCache = utils.storage.get('uploadedCache') || [];

			uploadedCache.forEach((e, i) => {
				if (e.hash === hash) {
					uploadedCache.splice(i, 1);
				}
			});

			utils.storage.set('uploadedCache', uploadedCache);
			this.$bus.$emit('uploadCache');
		},
		// 添加完成上传记录
		addUplaodFinishCache(res) {
			const uploadCacheList = utils.storage.get('uploadCacheList') || [];
			const data = {
				time: utils.formatTime(res.create_time),
				size: res.bytes,
				path: res.path,
				uuid: res.uuid,
			};

			uploadCacheList.unshift(data);

			utils.storage.set('uploadCacheList', uploadCacheList);
		},
		// hejia sdk 获取设备绑定信息
		hejiaReady(callback) {
			window.Hejia.ready(function () {
				// 页面加载完成后要立即调用Hejia全局对象执行的代码逻辑写这里
				const pramas = { paramName: ['devicePin'] };
				window.Hejia.getCurrentParam(
					pramas,
					(res) => {
						console.log('getCurrentParam', res);
						const [{ value = '' }] = res.parameters || [];

						if (!value) return;

						window.Hejia.getPhoneNumber(
							(phone) => {
								console.log('getPhoneNumber', phone);
								callback && callback(phone, value);
							},
							(err) => {
								console.log('getPhoneNumber', err);
							}
						);
					},
					(err) => {
						console.log('getCurrentParam', err);
					}
				);
			});
		},
		// 获取设备信息
		getDeviceInfo(code, phone) {
			// 校验手机号
			this.$axios
				.checkPhoneInfo(code, phone)
				.then((phone_res) => {
					const { code, device = {}, cookie } = phone_res;
					const { pin, proxy, bar_code } = device;
					this.deviceName = bar_code;

					utils.storage.set('bar_code', bar_code);

					if (code == 0 || code == 5018) {
						const pin_proxy = `http://${pin}.${proxy}`;

						utils.storage.set('pin_proxy', pin_proxy);

						// 获取token
						this.$axios
							.getToken(pin_proxy, cookie)
							.then((token_res) => {
								utils.storage.set('access_token', token_res.access_token);
								if (code == 0) {
									this.getDiskData();
								} else if (code == 5018) {
									if (phone_res.is_bind_admin) {
										// 普通用户绑定
										this.$axios
											.ordinaryUserBinding(phone_res.id, bar_code)
											.then((bind_res) => {
												console.log(bind_res);
												// 绑定设备
												!bind_res.code &&
													this.$axios
														.bindDevice(pin_proxy, phone_res.id, bar_code)
														.then((device_res) => {
															if (device_res.code == 0) {
																this.getDiskData();
															} else {
																console.log(device_res);
															}
														})
														.catch((err) => {
															console.log(err);
														});
											})
											.catch((err) => {
												console.log(err);
											});
									} else {
										this.$axios
											.bindDevice(pin_proxy, phone_res.id, bar_code)
											.then((device_res) => {
												if (device_res.code == 0) {
													this.getDiskData();
												} else {
													console.log(device_res);
												}
											})
											.catch((err) => {
												console.log(err);
											});
									}
								} else {
									console.log(token_res.code);
								}
							})
							.catch((err) => {
								console.log(err);
							});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		// 获取磁盘信息
		getDiskData() {
			this.resetInfo();
			const pin_proxy = utils.storage.get('pin_proxy');
			const access_token = utils.storage.get('access_token');
			this.$axios.getDiskData(pin_proxy, access_token).then((res) => {
				const list = res.disks || [];
				const arr = list.filter((e) => e.type === 'data');
				this.filelist = arr || [];
				// 渲染页面
				console.log('getDiskData', res);
			});
		},
		// 获取文件列表
		getFileList(item, callback) {
			this.resetInfo();

			console.log(item, 'item');
			const { uuid, path = '/' } = item;
			const pin_proxy = utils.storage.get('pin_proxy');
			const access_token = utils.storage.get('access_token');
			const params = { access_token, uuid, path };

			this.$axios
				.getFileList(pin_proxy, params)
				.then((res) => {
					this.filelist = res.contents;
					callback && callback();
				})
				.catch((err) => {
					console.log(err);
				});
		},
		// 重置
		resetInfo() {
			this.checklist = [];
		},
		// 导航
		addBread(item) {
			const crumb = { uuid: item.uuid, path: item.path, name: item.name };
			this.breadcrumbList.push(crumb);
		},
		// 面包屑导航
		crumbsChange(item, index) {
			if (this.breadcrumbList.length === index + 1) return;
			this.breadcrumbList.splice(index + 1);
			console.log(this.breadcrumbList, 'arr');

			if (!index) {
				this.isData = false;
			}

			if (item.uuid) {
				this.getFileList(item);
			} else {
				this.getDiskData();
			}
		},
		// 文件夹点击
		folderClick(item) {
			const { uuid, path = '/', name = path.slice(1) || '' } = item;
			const crumb = { uuid, path, name };
			const last = this.breadcrumbList[this.breadcrumbList.length - 1];

			if (path === last.path) return;

			this.getFileList(item, () => {
				this.breadcrumbList.push(crumb);
				this.isData = true;
			});
		},
		// 文件上传
		uploadFile(e) {
			console.log(e);
			const self = this;
			const [file = null] = e.target.files;
			if (!file) return;
			const pin_proxy = utils.storage.get('pin_proxy');
			const access_token = utils.storage.get('access_token');
			const bar_code = utils.storage.get('bar_code');
			const device_info = utils.getClientDeviceInfo();
			const item = this.breadcrumbList[this.breadcrumbList.length - 1];
			const filePath = item.path + '/' + file.name;

			const static_params = {
				access_token,
				uuid: item.uuid,
				path: filePath,
				device_flag: device_info,
				size: file.size,
				over_write: 1,
				device_info,
			};

			utils.getCompleteHash(file, function (simple_hash) {
				console.log(simple_hash, 'simple_hash');
				const quick_parmas = {
					uuid: item.uuid,
					path: filePath,
					hash: simple_hash,
				};

				// 检测hash
				self.quickUploadFile(quick_parmas, (res) => {
					console.log(res, 'quickUploadFile');
					if (res.code == 0) {
						// 磁盘已有
						self.addUplaodFinishCache(res);
						self.getFileList(item);
					} else if (res.code == 2022) {
						// 添加上传中记录
						self.addUplaodedCache(file.name, simple_hash);
						// 断点续传
						if (file.size <= 2097152) {
							// 2 *1024 *1024  小于2MB
							const formData = new FormData();
							const merge = { simple_hash, offset: 0 };
							const params = Object.assign({}, static_params, merge);

							formData.append('file', file);

							// 上传文件
							self.$axios
								.uploadFile(pin_proxy, formData, params)
								.then((res) => {
									console.log(res, 'upload');

									const params = {
										access_token,
										uuid: item.uuid,
										path: filePath,
										size: file.size,
										hash: simple_hash,
										simple_hash,
										device_flag: device_info,
										device_info: device_info,
										bar_code,
									};

									// 上传hash
									self.$axios
										.uploadHash(pin_proxy, params)
										.then((res) => {
											if (res.code == 0) {
												self.getFileList(item);
												// 删除上传中记录列表
												self.delUplaodedCache(simple_hash);
												// 添加完成后记录
												self.addUplaodFinishCache(res);
											}
										})
										.catch((err) => {
											// 上传失败
											self.addUplaodedCache(file.name, simple_hash, 1);
											console.log(err);
										});
								})
								.catch((err) => {
									self.addUplaodedCache(file.name, simple_hash, 1);
									console.log(err);
								});
						} else {
							// 超过2M启用分片上传
							self.shardUploadFiles(file, static_params);
						}
					} else if (res.code == 2008) {
						// 简单hash无效
						console.log('无效的hash');
					}
				});
			});
		},
		// 分片上传
		shardUploadFiles(file, static_params) {
			const self = this;
			let count = 0;
			const buffer = utils.toBuffer(file);
			const pieces = buffer.length;
			const pin_proxy = utils.storage.get('pin_proxy');
			let offset = 0; //记录上一次偏移量

			function fileShardUploadFiles(ufile, callback) {
				//获取快速hash
				utils.getFileHash(ufile, function (simple_hash) {
					const params = Object.assign({}, static_params, {
						simple_hash,
						offset,
						over_write: 1,
					});
					const formData = new FormData();
					formData.append('files', ufile);

					// 上传分片文件
					self.$axios
						.fileShardUploadFiles(pin_proxy, formData, params)
						.then((res) => {
							count++;
							offset = res.offset;
							console.log(res);
							callback && callback();
							if (count < pieces - 1) {
								fileShardUploadFiles(buffer[count]);
							} else if (count === pieces - 1) {
								fileShardUploadFiles(buffer[count], () => {
									// 上传完成hash
									utils.getCompleteHash(file, function (hash) {
										const merge = { simple_hash: hash, hash };
										const params = Object.assign({}, static_params, merge);

										self.$axios
											.uploadHash(pin_proxy, params)
											.then((res) => {
												console.log('上传完了', res);
												const breadItem =
													self.breadcrumbList[self.breadcrumbList.length - 1];
												const list_params = {
													access_token: static_params.access_token,
													uuid: static_params.uuid,
													path: breadItem.path,
												};

												// 上传完成
												self.addUplaodFinishCache(res);
												self.delUplaodedCache(hash);

												self.getFileList(list_params);
											})
											.catch((err) => {
												self.addUplaodedCache(file.name, simple_hash, 1);
												console.log(err);
											});
									});
								});
							}
						})
						.catch((err) => {
							self.addUplaodedCache(file.name, simple_hash, 1);
							console.log(err);
						});
				});
			}

			fileShardUploadFiles(buffer[0]);
		},
		// 秒传(检测hash)
		quickUploadFile(item = { uuid: '', hash: '', path: '' }, callback) {
			const pin_proxy = utils.storage.get('pin_proxy');
			const access_token = utils.storage.get('access_token');
			const device_info = utils.getClientDeviceInfo();
			const merge = { access_token, device_info, over_write: 0 };
			const params = Object.assign({}, merge, item);

			this.$axios
				.quickUploadFile(pin_proxy, params)
				.then((res) => {
					callback && callback(res);
				})
				.catch((err) => {
					callback && callback(err);
					console.log(err);
				});
		},
		//创建文件夹
		createFolderCancel() {
			this.createVisible = false;
		},
		createFolderSubmit() {
			const path = this.createFolderVal;
			if (!path) return;
			this.createFolder(`/${path}`);
			this.createFolderVal = '';
			this.createVisible = false;
		},
		createFolder(folderName) {
			const pin_proxy = utils.storage.get('pin_proxy');
			const access_token = utils.storage.get('access_token');
			const device_info = utils.getClientDeviceInfo();
			const item = this.breadcrumbList[this.breadcrumbList.length - 1];
			const { uuid = '', path } = item;
			const newname = path + folderName;
			const params = { access_token, uuid, path: newname, device_info };

			this.$axios
				.createFolder(pin_proxy, params)
				.then(() => {
					this.getFileList(item);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		//重命名
		renameFolderClick(item) {
			this.renameVisible = true;
			this.renameItem = item;
		},
		renameFolderCancel() {
			this.renameVisible = false;
			this.renameFolderVal = '';
		},
		renameFolderSubmit() {
			const name = this.renameFolderVal;
			if (!name) return;
			this.renameFolder();
			this.renameFolderVal = '';
			this.renameVisible = false;
		},
		renameFolder() {
			const pin_proxy = utils.storage.get('pin_proxy');
			const access_token = utils.storage.get('access_token');
			const device_info = utils.getClientDeviceInfo();
			const item = this.breadcrumbList[this.breadcrumbList.length - 1];
			const { uuid = '', path = '' } = this.renameItem;
			const newnameArr = path.split('/').slice(0, -1);
			newnameArr.push(this.renameFolderVal);
			const rename = newnameArr.join('/');

			const params = {
				access_token,
				from_uuid: uuid,
				from_path: path,
				to_uuid: uuid,
				to_path: rename,
				device_info,
				flag: 0,
				b_cross: 0,
			};

			this.$axios
				.renameFileOrFolder(pin_proxy, params)
				.then((res) => {
					if (res.code == 0) {
						this.getFileList(item);
						console.log(res.err_msg);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		//删除文件
		deleteBranchClick() {
			if (!this.checklist.length) return;

			this.deleteVisible = true;
		},
		deleteFolderCancel() {
			this.deleteVisible = false;
		},
		deleteFolderSubmit() {
			this.deleteVisible = false;
			this.deleteFolder();
		},
		deleteFolder() {
			const deleteArr = this.checklist.map((e) => ({
				uuid: e.uuid,
				path: e.path,
			}));

			const pin_proxy = utils.storage.get('pin_proxy');
			const access_token = utils.storage.get('access_token');
			const device_info = utils.getClientDeviceInfo();
			const params = { access_token, device_info };
			const item = this.breadcrumbList[this.breadcrumbList.length - 1];
			const data = { paths: deleteArr };

			this.$axios
				.deleteBranch(pin_proxy, data, params)
				.then((res) => {
					console.log(res);
					this.getFileList(item);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		createAnchor(item) {
			const anchor = document.createElement('a');
			const href = utils.downloadFilePath(item);
			anchor.href = href;
			// const name = utils.getRandom() + '.' + item.path.split('.').pop();
			const name = item.path.split('.').pop();
			anchor.setAttribute('download', name);
			console.log(anchor, 'item name');
			anchor.click();
			anchor.remove();
			console.log(item, 'createAnchor');
		},
		// 下载
		downloadFiles() {
			console.log(123456);
			const files = this.checklist.filter((e) => !e.is_dir);
			console.log(files);
			files.length && files.forEach((e) => this.createAnchor(e));
		},
	},
};
</script>

<style scoped>
.home-view-wrapper {
	display: flex;
	height: 100vh;
	flex-direction: column;
	justify-content: space-between;
}

.header-wrapper {
	height: 0.8rem;
	line-height: 0.8rem;
	background-color: #30c0b1;
	display: flex;
	justify-content: space-between;
	color: #fff;
	padding: 0 0.2rem;
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

.header-right label {
	margin-right: 0.2rem;
}

.header-center {
	flex: 1;
	text-align: center;
}

.crumbs-wrapper {
	height: 1rem;
	display: flex;
	padding: 0 0.4rem;
	align-items: center;
	background-color: #f9f9f9;
	color: #999;
}

.file-list-wrapper {
	width: 100%;
	padding: 0 0.4rem;
	box-sizing: border-box;
}

.file-list-wrapper > ul {
	width: 100%;
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
	width: 100%;
	height: 1.44rem;
	align-items: center;
	box-sizing: border-box;
	overflow: hidden;
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
	width: 100%;
	font-size: 0.32rem;
	flex: 1;
}

.file-info-main .file-info-des,
.folder-info-main .folder-info-des {
	color: #ccc;
}

.file-info-des.file {
	display: flex;
	justify-content: space-between;
	font-size: 0.24rem;
}

.folder-info-main {
	flex: 1;
	display: flex;
	align-items: center;
	overflow: hidden;
	padding-right: 0.2rem;
	justify-content: space-between;
}

.file-control {
	width: 1rem;
	height: 0.64rem;
	line-height: 0.64rem;
	text-align: center;
	color: #bbb;
	white-space: nowrap;
}

.node-data-wrapper {
	text-align: center;
	height: 2rem;
	line-height: 2rem;
	color: #ccc;
}

.dialog-wrapper {
	position: fixed;
	height: 100%;
	width: 100%;
	left: 0;
	top: 0;
	background-color: rgba(0, 0, 0, 0.3);
}

.dialog-inner-wrapper {
	width: 4.8rem;
	background-color: #fff;
	position: absolute;
	left: 50%;
	top: 30%;
	transform: translateX(-50%);
	border-radius: 0.1rem;
	padding: 0 0.6rem 0.4rem;
}

.dialog-inner-main {
	margin: 0.4rem 0 0.6rem 0;
}

.dialog-inner-wrapper p {
	height: 1rem;
	line-height: 1rem;
	font-size: 0.32rem;
}

.dialog-inner-wrapper input {
	box-sizing: border-box;
	width: 100%;
	height: 0.7rem;
	border-radius: 0.1rem;
	padding-left: 0.2rem;
}

.dialog-inner-wrapper button {
	height: 0.7rem;
	line-height: 0.7rem;
	padding: 0 0.4rem;
	border: 1px solid #ccc;
	border-radius: 0.1rem;
}

.dialog-inner-wrapper .dialog-inner-btns {
	text-align: right;
}

.dialog-inner-wrapper button.create-cancel {
	border: 1px solid #ccc;
	background-color: #fff;
}

.dialog-inner-wrapper button.create-submit {
	border: 1px solid #00a2f4;
	background-color: #00a2f4;
	color: #fff;
	margin-left: 0.4rem;
}
</style>
