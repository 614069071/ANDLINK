<template>
	<div class="home-view-wrapper">
		<header class="header-wrapper">
			<div class="header-left">
				<span class="header-back">&lt;</span>
				<div class="header-device ellipsis">设备名设备名设备名设备名设备名设备名</div>
			</div>
			<div class="header-center">我的云盘</div>
			<div class="header-right">
				<label><input type="file" hidden @change="uploadFile($event)" />上传</label>
				<span>新建</span>
			</div>
		</header>

		<main class="main-wrapper">
			<div class="crumbs-wrapper">全部磁盘>sda1</div>

			<!-- 文件列表 -->
			<div class="file-list-wrapper">
				<ul>
					<li class="file-item-wrapper" v-for="item in 20" :key="item">
						<label class="file-check">
							<input type="checkbox" :value="item" v-model="list" />
						</label>

						<div class="file-info">
							<template v-if="item % 2">
								<div class="file-info-img">
									<img src="../../assets/logo.png" alt="" />
								</div>

								<div class="file-info-main">
									<p class="file-info-title ellipsis">test.jpg</p>
									<p class="file-info-des"><span>4.08KB</span>2021-02-0417:34:50<span></span></p>
								</div>
							</template>

							<template v-else>
								<div class="file-info-img">
									<img src="../../assets/folder.png" alt="" />
								</div>
								<div class="folder-info-main">
									<p class="folder-info-title ellipsis">test</p>
									<p class="folder-info-des">2021-02-0417:34:50</p>
								</div>
							</template>

						</div>

						<div class="file-control">重命名</div>
					</li>
				</ul>
			</div>
		</main>

		<footer class="footer-wrapper">
			<span>删除</span>
			<span>下载</span>
			<span @click="$router.push('/upload')">任务</span>
		</footer>
	</div>
</template>

<script>
import '../../utils/hejia.min';
import utils from '../../utils';

export default {
	name: 'Home',
	data() {
		return {
			list: [],
		};
	},
	created() {
		const phone = '13444444444';
		const pinCode = '44444444444';

		this.getDeviceInfo(pinCode, phone);

		// console.log(window.Hejia, 'Hejia sdk');
	},
	mounted() {
		console.log('mounted');
	},
	methods: {
		uploadFile(e) {
			console.log(e);
			// this.hejiaReady(this.getDeviceInfo);
		},
		hejiaReady(callback) {
			window.Hejia.ready(function () {
				// 页面加载完成后要立即调用Hejia全局对象执行的代码逻辑写这里
				const pramas = { paramName: ['devicePin'] };
				window.Hejia.getCurrentParam(
					pramas,
					(res) => {
						console.log('getCurrentParam', res);
						const { value } = res.parameters[0];

						if (value) {
							window.Hejia.getPhoneNumber(
								(res) => {
									console.log('getPhoneNumber', res);
									callback && callback(value, res);
								},
								(err) => {
									console.log('getPhoneNumber', err);
								}
							);
						}
					},
					(err) => {
						console.log('getCurrentParam', err);
					}
				);
			});
		},
		getDeviceInfo(code, phone) {
			// 校验手机号
			this.$axios
				.checkPhoneInfo(code, phone)
				.then((phone_res) => {
					const { code, device = {}, cookie } = phone_res;
					const { pin, proxy, bar_code } = device;
					if (code == 0 || code == 5018) {
						const pin_proxy = `http://${pin}.${proxy}`;

						utils.storage.set('pin_proxy', pin_proxy);

						// 获取token
						this.$axios
							.getToken(pin_proxy, cookie)
							.then((token_res) => {
								utils.storage.set('accessToken', token_res.access_token);
								if (code == 0) {
									this.getDiskData(pin_proxy, token_res.access_token);
								} else if (code == 5018) {
									// 普通用户绑定
									phone_res.is_bind_admin &&
										this.$axios
											.ordinaryUserBinding(phone_res.id, bar_code)
											.then((bind_res) => {
												console.log(bind_res);
												// 绑定设备
												!bind_res.code &&
													this.$axios
														.bindDevice(pin_proxy, phone_res.id, bar_code)
														.then((device_res) => {
															// console.log(device_res);
															if (device_res.code == 0) {
																this.getDiskData(
																	pin_proxy,
																	token_res.access_token
																);
															} else if (device_res.code == 5006) {
																this.$axios.bindDevice(
																	pin_proxy,
																	phone_res.id,
																	bar_code
																);
															} else {
																console.log(device_res.code);
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
		getDiskData(pin_proxy, access_token) {
			this.$axios.getDiskData(pin_proxy, access_token).then((disk_res) => {
				// 渲染页面
				console.log('getDiskData', disk_res);
			});
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
	width: 1rem;
	height: 0.64rem;
	line-height: 0.64rem;
	text-align: center;
	color: #bbb;
}
</style>
