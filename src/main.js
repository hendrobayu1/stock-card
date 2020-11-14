import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import './plugins/helper'
require('@/assets/style.css')
import moment from 'moment-timezone'
// import jspdf from 'jspdf'
import excel from 'vue-excel-export'
import './plugins/vuetify-money.js'
import * as arrialnarrow from './assets/fonts/ARIALN-normal.js'
import * as arrialnarrow_bold from './assets/fonts/ARIALN-bold.js'
import * as arrialnarrow_italic from './assets/fonts/ARIALN-italic.js'

moment.tz.setDefault('Asia/Jakarta')

Vue.config.productionTip = false
Vue.use(excel,arrialnarrow,arrialnarrow_bold,arrialnarrow_italic)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
