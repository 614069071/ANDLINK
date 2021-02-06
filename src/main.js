import Vue from 'vue'
import App from './App.vue'
import router from './router'
import fetch from './fetch';

Vue.prototype.$axios = fetch;

import './styles/base.css';
import './styles/common.css';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
