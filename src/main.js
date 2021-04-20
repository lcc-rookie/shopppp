import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import '../src/assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'

axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/"
Vue.config.productionTip = false;
Vue.prototype.$http = axios

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')