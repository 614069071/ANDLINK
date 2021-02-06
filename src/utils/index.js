import JsMd5 from 'js-md5';

const storage = {
  set(key, value) {
    if (typeof value === 'object' && value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
      return;
    }
    localStorage.setItem(key, value);
  },
  get(key) {
    const value = localStorage.getItem(key) || '';
    let val = null;
    try {
      val = JSON.parse(value);
    } catch (e) {
      return value;
    }

    if (typeof val === 'number') {
      return value;
    }
    return val;
  },
  del(key) {
    localStorage.removeItem(key);
  }
}

function toBety(size) {
  var c = 0;
  var num = size;
  var bety = ['K', 'M', 'G', 'T'];

  while (num >= 1024) {
    num /= 1024;
    c++;
  }

  return num.toFixed(2) + bety[c];
}

function browserVersion() {
  var ua = window.navigator.userAgent;
  var version = '',
    chrome = ua.match(/Chrome\/([\d.]+)/) ||
      ua.match(/CriOS\/([\d.]+)/),

    ie = ua.match(/MSIE\s([\d.]+)/) ||
      ua.match(/(?:trident)(?:.*rv:([\w.]+))?/i),
    firefox = ua.match(/Firefox\/([\d.]+)/),
    safari = ua.match(/Safari\/([\d.]+)/),
    opera = ua.match(/OPR\/([\d.]+)/);

  chrome && (version = parseFloat(chrome[1]));
  ie && (version = parseFloat(ie[1]));
  firefox && (version = parseFloat(firefox[1]));
  safari && (version = parseFloat(safari[1]));
  opera && (version = parseFloat(opera[1]));
  return version;
}

let client_device_info = null;

function getClientDeviceInfo() {
  var version = browserVersion();
  var ua = window.navigator.userAgent;
  if (!client_device_info) {
    client_device_info = JsMd5(version + ua); //设备信息
  }
  return client_device_info;
}

export default {
  storage, toBety, getClientDeviceInfo
}