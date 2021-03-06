import axios from './axios';
import api from './api';
const server = {
  loca: 'http://192.168.8.160:8001/', //本地
  deve: 'http://rapi.filedisk.info/', //开发 
  prod: 'http://rapi-hs-pdt.filelist.info/',//生产
  test: 'http://rapi-hs-test.filelist.info/', //测试
};
const server_url = server.test;
const IS_PHONE_BIND = server_url + '/c/checkPhoneInfo';
const NORMAL_USER_BIND = server_url + '/c/normalUserBindDeviceH5';

export default {
  checkPhoneInfo: (code, phone) => {
    const params = { phone: phone, pin: code };
    return axios.get(IS_PHONE_BIND, { params });
  },
  getToken: (pin_proxy, accessCookie) => {
    const params = {
      grant_type: 'cookie',
      cookie: accessCookie,
      device_type: 'DEVICE_IPHONE',
      device_name: 'iPhone',
      device_info: '82824d87f81b41e6b24798c6b71a0e48',
      client_id: 'UmxT6CuwQYrtJGFp',
      client_secret: 'GxsxayamApUSwTq9'
    };

    return axios.get(pin_proxy + api.GET_TOKEN, { params })
  },
  getDiskData: (pin_proxy, access_token) => {
    const url = `${pin_proxy}${api.GET_STORAGE_LIST}`;
    const params = { access_token };

    return axios.get(url, { params });
  },
  ordinaryUserBinding: (user_id, bar_code) => {
    const data = { user_id, bar_code, app_type: '1020' };
    return axios.post(NORMAL_USER_BIND, data);
    // return axios.post(NORMAL_USER_BIND, JSON.stringify(data));
  },
  bindDevice: (pin_proxy, user_id, bar_code) => {
    const url = pin_proxy + api.BIND_DEVICE;
    const params = { user_id, bar_code };

    return axios.get(url, { params });
  },
  getFileList: (pin_proxy, params) => {
    const url = pin_proxy + api.GET_FILE_LIST;
    // const params = { access_token, uuid, path };

    return axios.get(url, { params })
  },
  // 创建文件夹
  createFolder(pin_proxy, params) {
    const url = pin_proxy + api.CREAT_FOLDER;

    return axios.get(url, { params });
  },
  // 批量删除
  deleteBranch(pin_proxy, data, params) {
    const url = pin_proxy + api.DELETE_FILE_OR_FOLDER_IN_BRANCH;

    return axios.post(url, JSON.stringify(data), { params });
  },
  // 重命名
  renameFileOrFolder(pin_proxy, params) {
    const url = pin_proxy + api.MOVE_FILE_OR_FOLDER;

    return axios.get(url, { params });
  },
  // 下载
  downloadFile(pin_proxy, params) {
    const url = pin_proxy + api.DOWNLOAD_FILE;

    return axios.get(url, { params });
  },
  // 上传文件
  uploadFile(pin_proxy, data, params) {
    const url = pin_proxy + api.UPLOAD_FILE_2_PRIVATE

    return axios.post(url, data, { params });
  },
  // 上传hash(分片完整hash)
  uploadHash(pin_proxy, params) {
    const url = pin_proxy + api.GET_ALL_FILE_HASH;

    return axios.get(url, { params });
  },
  // 分片上传
  fileShardUploadFiles(pin_proxy, file, params) {
    const url = pin_proxy + api.UPLOAD_FILE_BY_BLOCK_2_PRIVATE;
    return axios.post(url, file, { params });
  },
  // 秒传(检测hash)
  quickUploadFile(pin_proxy, params) {
    const url = pin_proxy + api.UPLOAD_FILE_BY_HASH_2_PRIVATE;

    return axios.get(url, { params });

  }
}


