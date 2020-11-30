import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import routes from './routes'
import store from './store'
import './assets/scss/style.scss'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuex from 'vuex'
import VueWait from 'vue-wait'
import VueLoading from 'vuex-loading'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuex)
Vue.use(VueLoading)
Vue.config.productionTip = false;


const router = new VueRouter({
  routes,
  mode: 'history',
  wait: new VueWait()
});

router.beforeEach((to, from, next) => {
  // Set title
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Update meta
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  if (nearestWithTitle) {
    document.title = `${nearestWithTitle.meta.title} | ${App.name}`;
  } else { // ← here ↓
    document.title = `${previousNearestWithMeta.meta.title} | ${App.name}`
  }
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
  .forEach(tag => document.head.appendChild(tag));

  next();
});

new Vue({
  router,
  el: '#app',
  store: store,
  vueLoading: new VueLoading({
    // Defaults values are following:
    useVuex: true,              // Uses Vuex to manage loading state
    vuexModuleName: 'loading',   // Vuex module name

    registerComponent: true,      // Registers `v-loading` component
    // componentName: 'v-loading',  // <v-loading> component name, you can set `my-loader` etc.

    registerDirective: true      // Registers `v-loading` directive
    // directiveName: 'loading',    // <span v-loading /> directive name, you can set `my-loader` etc.

  }),
  render: h => h(App)
}).$mount('#app')
