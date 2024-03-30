import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {OiLocation} from "oh-vue-icons/icons/oi";
import {RiCalendarEventFill} from "oh-vue-icons/icons/ri/index.js";


addIcons(OiLocation,RiCalendarEventFill);
const app = createApp(App)


app.use(createPinia())
app.use(router)
app.component("v-icon", OhVueIcon);
app.mount('#app')
