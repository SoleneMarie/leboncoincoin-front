import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import VueCookies from 'vue-cookies'

import {
  faSearch,
  faUser,
  faPlusSquare,
  faHeart,
  faCheckDouble,
  faLocationDot,
  faAngleLeft,
  faAngleRight,
  faEye,
  faEyeSlash,
  faArrowRight,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular, faClock } from '@fortawesome/free-regular-svg-icons'

library.add(
  faSearch,
  faUser,
  faPlusSquare,
  faHeart,
  faHeartRegular,
  faClock,
  faCheckDouble,
  faLocationDot,
  faAngleLeft,
  faAngleRight,
  faEye,
  faEyeSlash,
  faArrowRight,
  faSpinner,
)

const app = createApp(App)

const userToken = ref('')
const userName = ref('')

app.provide('GlobalStore', { userToken: userToken, userName: userName })

app.use(router)
app.use(VueCookies, { expires: 60, secure: true })

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
