import Vue from 'vue'
import App from './App.vue'
import router from './router'
import fetch from './fetch';
import utils from './utils';

Vue.prototype.$axios = fetch;

import './styles/base.css';
import './styles/common.css';

Vue.filter('toBety', size => {
  return utils.toBety(size);
});

Vue.filter('dePath', item => {
  const { uuid, path } = item;
  const pin_proxy = utils.storage.get('pin_proxy');
  const access_token = utils.storage.get('access_token');
  var DOWNLOAD_FILE_PRIVATE = '/downloadFile';
  return `${pin_proxy}.${DOWNLOAD_FILE_PRIVATE}?access_token=${access_token}&uuid=${uuid}&path=${path}`;
});

Vue.filter('formatTime', time => {
  return utils.formatTime(time);
});



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
