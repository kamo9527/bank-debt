import Vue from 'vue';
import App from './App.vue';
import router from './router';
// import store from './store';
import 'amfe-flexible/index.js';
import './assets/css/reset.less';
import initApp from '@/utils/initApp';
import { TextInput, Toast, Scroller, Dialog, Picker } from '@nutui/nutui';

// 运行时动态加载
import('./utils/fastclickHack');
// 初始化一些配置
initApp();

// 更改所有Toast展示时长设置为5000毫秒
Toast.setDefaultOptions({
  duration: 1500,
});
// Cell.install(Vue);
// Checkbox.install(Vue);
TextInput.install(Vue);
Toast.install(Vue);
Scroller.install(Vue);
Dialog.install(Vue);
Picker.install(Vue);

Vue.config.productionTip = false;
Vue.filter('toThousandsText', num => {
  if (!num || num === '0' || num === '0.00') {
    return '0.00';
  }
  const ll = (num / 100).toString().split('.');
  let value = ll[0];
  let res = ll[1];
  let result = '';
  while (value.length > 3) {
    result = ',' + value.slice(-3) + result;
    value = value.slice(0, value.length - 3);
  }
  if (value) {
    result = value + result;
  }
  return res ? `${result}.${res.slice(0, 2)}` : result;
});
new Vue({
  router,
  // store,
  render: h => h(App),
}).$mount('#app');
