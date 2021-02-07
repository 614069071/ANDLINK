import axios from './axios';
import api from './api';
const IS_PHONE_BIND = 'http://rapi.filedisk.info/c/checkPhoneInfo';
const NORMAL_USER_BIND =
  'https://gr-share.com/c/normalUserBindDeviceH5';
// let deviceUrl = '';

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

    console.log(123)

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
  deleteBranch() {

  },
  // 重命名
  renameFileOrFolder(pin_proxy, params) {
    const url = pin_proxy + api.MOVE_FILE_OR_FOLDER;

    return axios.get(url, { params });
  }
}


