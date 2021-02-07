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

function getFileHash(file, success, error) {  //获取文件对应的hash值
  var _funH = this;
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
    chunkSize = 2097152,                             // Read in chunks of 2MB
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0;

  _funH.sha1Encode = new SHA('SHA-1', 'BYTES');

  _funH.fileReader = new FileReader();

  _funH.fileReader.onload = function (e) {
    currentChunk++;
    //if(FILE_UPLOAD_DEBUG){ console.log('read chunk nr', currentChunk, 'of', chunks);}
    if (e && e.target) {
      _funH.sha1Encode.update(e.target.result);
    } else {
      const buff = getFileReaderBufferToStr(e.result);
      _funH.sha1Encode.update(buff);
    }

    //if(FILE_UPLOAD_DEBUG){ console.log('start next chunk');}
    if (currentChunk < chunks) {
      loadNext();
    } else {
      _funH.is_cal_hash = false;
      //if(FILE_UPLOAD_DEBUG){ console.log('finished loading');}
      var hash = _funH.sha1Encode.getHash('HEX').toLowerCase();
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
    var start = currentChunk * chunkSize,
      end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
    try {
      if (FileReader.hasBinaryString) {
        _funH.fileReader.readAsBinaryString(blobSlice.call(file, start, end));
      } else {
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

export default {
  storage, toBety, getClientDeviceInfo, downloadFilePath, getFileHash, dePath
}