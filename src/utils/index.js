import JsMd5 from 'js-md5';
import SHA from './sha';

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
  let c = 0;
  let num = size;
  let bety = ['KB', 'MB', 'GB', 'TB'];

  while (num > 1024) {
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

function downloadFilePath(item) {
  const { uuid, path } = item;
  const pin_proxy = storage.get('pin_proxy');
  const access_token = storage.get('access_token');
  var DOWNLOAD_FILE_PRIVATE = '/downloadFile';
  return `${pin_proxy}.${DOWNLOAD_FILE_PRIVATE}?access_token=${access_token}&uuid=${uuid}&path=${path}`;
}

function getFileReaderBufferToStr(result) {
  var binary = "";
  var bytes = new Uint8Array(result);
  var length = bytes.byteLength;
  for (var i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  bytes = undefined;
  //pt.result  - readonly so assign binary
  return binary;
}

function addReadAsBinaryString() {
  //不存在时，重写readAsBinaryString
  //extend FileReader
  if (!FileReader.prototype.readAsBinaryString) {
    FileReader.prototype.readAsBinaryString = function (fileData) {
      var reader = new FileReader();
      reader.readAsArrayBuffer(fileData);
    }
    FileReader.hasBinaryString = false;
  } else {
    FileReader.hasBinaryString = true;
  }
}

addReadAsBinaryString();

// 获取文件hash
function getFileHash(file, success, error) {  //获取文件对应的hash值
  var _funH = {};
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0;

  _funH.sha1Encode = new SHA('SHA-1', 'BYTES');

  _funH.fileReader = new FileReader();

  _funH.fileReader.onload = function (e) {
    currentChunk++;
    if (e && e.target) {
      _funH.sha1Encode.update(e.target.result);
    } else {
      const buff = getFileReaderBufferToStr(e.result);
      _funH.sha1Encode.update(buff);
    }

    if (currentChunk < chunks) {
      loadNext();
      console.log('大于2M loadNext')
    } else {
      _funH.is_cal_hash = false;
      var hash = _funH.sha1Encode.getHash('HEX').toLowerCase();
      console.log(hash, 'getFileHash hash')
      _funH.sha1Encode = null;
      if (_funH.fileReader) {
        _funH.fileReader.m_is_abort = true;
        _funH.fileReader.abort();
        _funH.fileReader = null;
      }

      success(hash);
    }
  };

  _funH.fileReader.onerror = function () {
    _funH.sha1Encode = null;
    if (_funH.fileReader) {
      _funH.fileReader.m_is_abort = true;
      _funH.fileReader.abort();
      _funH.fileReader = null;
    }
    // if (_funH.status != Uploader.STATUS_PAUSE) {
    error();
    // }
  };

  _funH.fileReader.onabort = function () {

    _funH.sha1Encode = null;
  }

  //开始读取文件流。或读取下一条数据
  function loadNext() {
    var start = currentChunk * chunkSize;
    var end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
    try {
      if (FileReader.hasBinaryString) {
        console.log('loadNext readAsBinaryString')
        _funH.fileReader.readAsBinaryString(blobSlice.call(file, start, end));
      } else {
        console.log('loadNext readAsArrayBuffer')
        _funH.fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (_funH.fileReader) {
    _funH.fileReader.m_is_abort = false;
  }
  loadNext();
}

function dePath(item) {
  const { uuid, path } = item;
  const pin_proxy = storage.get('pin_proxy');
  const access_token = storage.get('access_token');
  var DOWNLOAD_FILE_PRIVATE = '/downloadFile';
  return `${pin_proxy}.${DOWNLOAD_FILE_PRIVATE}?access_token=${access_token}&uuid=${uuid}&path=${path}`;
}

// 统一格式
// function formatNumber(n) {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// // 序列化时间
// function formatTime(time) {
//   const date = new Date(time).getTime();
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   const ymd = [year, month, day].map(formatNumber).join('-');
//   const hms = [hour, minute, second].map(formatNumber).join(':');
//   return ymd + ' ' + hms;
// }

function add0(m) { return m < 10 ? '0' + m : m }

//将Date转换为 yyyy-MM-dd hh:mm:ss
function getNowFormatDate(mDate) {
  var seperator1 = "-";
  var seperator2 = ":";
  var currentdate = mDate.getFullYear() + seperator1 + add0(mDate.getMonth() + 1) + seperator1 + add0(mDate.getDate())
    + " " + add0(mDate.getHours()) + seperator2 + add0(mDate.getMinutes()) + seperator2 + add0(mDate.getSeconds());
  return currentdate;
}

/* 将秒的时间戳转换为日期字符串 yyyy-MM-dd hh:mm:ss*/
function formatTime(nS) {
  var mDate = new Date(nS * 1000);
  return getNowFormatDate(mDate);
}

function getRandom() {
  const timeStamp = new Date().getTime();
  let returnStr = "";
  // let range = (max ? Math.round(Math.random() * (max - min)) + min : min);
  const arr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (var i = 0; i < 10; i++) {
    var index = Math.round(Math.random() * (arr.length - 1));
    returnStr += arr[index];
  }
  return timeStamp + returnStr;
}


function getFileJumpSize(fSize) {
  var ONE_MEAG = 1024 * 1024;
  const mSize = fSize / ONE_MEAG;//文件有多少M

  if (mSize <= 10) {
    return 0;
  } else if (mSize <= 100) { //小于100M
    return ONE_MEAG; //每跳过1M
  } else if (mSize <= 1024) { //小于1G
    return ONE_MEAG * 10; //每跳过10M
  } else {
    return ONE_MEAG * 100; //每跳过100M
  }
}

//获取文件的快速hash值
function loadFromBlob(file, success) {
  var ONE_MEAG = 1024 * 1024,
    chunkSize = 2 * 1024 * 1024,
    chunks = Math.ceil(file.size / chunkSize),
    jumpFileSize = 0,
    lastChunk = false,
    currentChunk = 0,
    hashSha1 = new SHA('SHA-1', 'BYTES'),
    me = this,
    blobSlice = file.mozSlice || file.webkitSlice || file.slice,
    arrayBufferToStr, loadNext, loadOver, fr;

  jumpFileSize = getFileJumpSize(file.size);

  if (jumpFileSize > 0) {
    chunkSize = 1024 * 10; //截取10kb
    chunks = Math.ceil(file.size / jumpFileSize);
  } else {
    chunks = Math.ceil(file.size / chunkSize);
  }

  fr = new FileReader();

  arrayBufferToStr = function (result) {
    var bs = "";
    var bytes = new Uint8Array(result);
    var l = bytes.byteLength;
    for (var i = 0; i < l; i++) {
      bs += String.fromCharCode(bytes[i]);
    }
    bytes = undefined;
    return bs;
  }
  loadOver = function () {
    setTimeout(function () {
      var nhahs = hashSha1.getHash('HEX');
      success(nhahs);
      loadNext = arrayBufferToStr = loadOver = file = hashSha1 = null;
    }, 50);
  }
  loadNext = function () {

    console.log(123456)

    var start, end;

    if (jumpFileSize > 0) {  //读取文件的位置
      if (currentChunk == 0) {
        start = 0;
        end = ONE_MEAG;
      } else if (currentChunk == 1 && !lastChunk) {  //第二次读取。读最后一块
        start = file.size - ONE_MEAG;
        end = file.size;
      } else if (currentChunk < chunks) {
        end = currentChunk * (jumpFileSize + chunkSize); //快速hash只读取10K的数据
        start = end - chunkSize;
        if (end > file.size) {  //结束抽取
          loadOver();
          return;
        }
      }
    } else {
      lastChunk = true;
      start = currentChunk * chunkSize;
      end = start + chunkSize;
      if (end > file.size) {
        end = file.size
      }
    }

    if (fr.hasBinaryString) {
      fr.readAsBinaryString(blobSlice.call(file, start, end));
    } else {
      fr.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    fr.onload = function () {
      if (currentChunk == 1 && !lastChunk) {
        lastChunk = true;
        console.log('截取尾部1M hash = ' + lastChunk)
      } else {
        currentChunk++;
      }

      hashSha1.update(arrayBufferToStr(this.result));
    };

    fr.onloadend = function () {
      fr.onloadend = fr.onload = null;

      if (currentChunk < chunks) {
        setTimeout(loadNext, 1);
      } else {
        loadOver();
      }
    };
  };

  loadNext();
}

function toBuffer(file = {}, fz = 2097152) {
  const { size = 0 } = file;
  const n = Math.ceil(size / fz);
  const a = new Array(n).fill(null);
  const buffer = a.map((e, i) => file.slice(i * fz, (i + 1) * fz));

  return buffer;
}

// 获取文件hash
function getCompleteHash(file, callback) {
  const fileReader = new FileReader();
  const sha1Encode = new SHA('SHA-1', 'BYTES');

  fileReader.readAsBinaryString(file);

  fileReader.onload = function (e) {
    console.log(e, 'getCompleteHash');

    if (e && e.target) {
      sha1Encode.update(e.target.result);
    } else {
      const buff = getFileReaderBufferToStr(e.result);
      sha1Encode.update(buff);
    }

    const hash = sha1Encode.getHash('HEX').toLowerCase();

    callback(hash);
  };
}

export default {
  storage, toBety, getClientDeviceInfo, downloadFilePath, getFileHash,
  dePath, formatTime, getRandom, loadFromBlob, toBuffer, getCompleteHash
}