import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import 'chartist/dist/chartist.min.css'
import 'bootstrap/dist/css/bootstrap.css'

// import SetComponents from './set-components'

import VueRouter from 'vue-router'
import routes from './router/router'

import './components'

Vue.use(VueRouter)
// Vue.use(SetComponents)
Vue.use(require('vue-chartist'))

const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active',
  scrollBehavior: (to) => {
    if (to.hash) {
      return {selector: to.hash}
    } else {
      return { x: 0, y: 0 }
    }
  }
})

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App),
  router
}).$mount('#app')
