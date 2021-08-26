import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import './assets/my-theme/index.less';
import './assets/styles/reset.scss';
import VueI18n from 'vue-i18n'
import router from "./router";
import en from 'view-design/dist/locale/en-US';
import zh from 'view-design/dist/locale/zh-CN';
let obj = {zh: zh, en: en}
Vue.use(ViewUI)
Vue.use(VueI18n)
let lang = localStorage.getItem('lang') || 'zh'
ViewUI.locale(obj[lang])
localStorage.setItem('lang', lang)
const i18n = new VueI18n({
  locale: localStorage.getItem('lang'),    // 语言标识
  // this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh': require('./common/lang/zh'),   // 中文语言包
    'en': require('./common/lang/en')    // 英文语言包
  }
})
Vue.config.productionTip = false
new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount("#app");
console.log(localStorage.getItem('lang'))
