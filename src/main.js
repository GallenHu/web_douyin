// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
// import FastClick from 'fastclick';
import VueRouter from 'vue-router';
import App from './App';
// import Home from './components/HelloFromVux';
import Douyin from './components/Douyin';

Vue.use(VueRouter);

const routes = [{
  path: '/',
  redirect: '/douyin',
}, {
  path: '/douyin',
  component: Douyin,
}];

const router = new VueRouter({
  routes,
});

// FastClick.attach(document.body);

Vue.config.productionTip = false;

window.app = {
  width: document.documentElement.clientWidth,
};

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App),
}).$mount('#app-box');
