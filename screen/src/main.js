/* eslint-disable no-unused-vars */
import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import 'chartist/dist/chartist.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import Vuebar from 'vuebar';
import VueGoogleCharts from 'vue-google-charts';


import VueRouter from 'vue-router';
import routes from './router/router';

import './components';

Vue.use(VueRouter);
Vue.use(Vuebar);
Vue.use(VueGoogleCharts)
Vue.use(require('vue-chartist'));

const ignoreWarnMessage = 'The .native modifier for v-on is only valid on components but it was used on <div>.';
Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` is the component hierarchy trace
  if (msg === ignoreWarnMessage) {
    msg = null;
    vm = null;
    trace = null;
  }
}

const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active',
  scrollBehavior: (to) => {
    if (to.hash) {
      return {selector: to.hash};
    } else {
      return { x: 0, y: 0 };
    }
  }
});

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App),
  router
}).$mount('#app')
