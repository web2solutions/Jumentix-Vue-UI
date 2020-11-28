// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueTour from 'vue-tour'
import Vuetify from 'vuetify'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import './theme/default.styl'
import 'vue-wysiwyg/dist/vueWysiwyg.css'
import './theme/EntityBuilder.css'
import VeeValidate from 'vee-validate'
import colors from 'vuetify/es5/util/colors'
import Truncate from 'lodash.truncate'

import wysiwyg from 'vue-wysiwyg'

import { sha512 } from 'js-sha512'
import moment from 'moment-timezone'
import jQuery from 'jquery'
import swal from 'sweetalert2'

import session from './helpers/session'
import Mediator from './Mediator'

import store from './helpers/store'

global.moment = moment
global.sha512 = sha512
global.session = session
global.moment = moment
global.swal = swal
global.$ = jQuery
global.jQuery = jQuery
global.$mclient = null
global.store = store

Vue.prototype.moment = moment
Vue.prototype.store = store
Vue.prototype.session = session
Vue.prototype.Mediator = Mediator

Vue.config.productionTip = false
require('vue-tour/dist/vue-tour.css')
Vue.use(VueTour)
// Helpers
// Global filters
Vue.filter('truncate', Truncate)
Vue.use(VeeValidate, { fieldsBagName: 'formFields' })
Vue.use(Vuetify, {
  // theme: {
  //   primary: colors.indigo.base, // #E53935
  //   secondary: colors.indigo.lighten4, // #FFCDD2
  //   accent: colors.indigo.base // #3F51B5
  // },
  options: {
    themeVariations: ['primary', 'secondary', 'accent'],
    extra: {
      mainToolbar: {
        color: 'primary'
      },
      sideToolbar: {
      },
      sideNav: 'primary',
      mainNav: 'grey lighten-1',
      bodyBg: ''
    }
  }
})

Vue.use(wysiwyg, { maxHeight: '100%' })
// Bootstrap application components



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  Mediator,
  session,
  components: { App },
  template: '<App/>'
})
