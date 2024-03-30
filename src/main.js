import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {OiLocation} from "oh-vue-icons/icons/oi";
import {RiCalendarEventFill} from "oh-vue-icons/icons/ri/index.js";
import {FaSearch, FaTicketAlt} from "oh-vue-icons/icons/fa/index.js";
import {IoTicketSharp} from "oh-vue-icons/icons/io/index.js";




addIcons(OiLocation,RiCalendarEventFill,FaSearch,FaTicketAlt,IoTicketSharp);
const app = createApp(App)


app.use(createPinia())
app.use(router)
app.component("v-icon", OhVueIcon);
app.mount('#app')
