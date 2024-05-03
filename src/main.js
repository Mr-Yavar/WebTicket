import './assets/main.css'
import 'animate.css';
import 'vue-select/dist/vue-select.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {addIcons, OhVueIcon} from "oh-vue-icons";
import {OiLocation} from "oh-vue-icons/icons/oi";
import {RiCalendarEventFill} from "oh-vue-icons/icons/ri/index.js";
import {FaSearch, FaTicketAlt,FaTimes} from "oh-vue-icons/icons/fa/index.js";
import {IoTicketSharp,IoArrowForwardOutline} from "oh-vue-icons/icons/io/index.js";


import VeeValidatePlugin from "./config/veevalidate.js";
import registerLayouts from "@/config/_registerLoayouts.js";
import {PrSpinner} from "oh-vue-icons/icons/pr";
import { PxCalendarTomorrow,PxClock,PxGps    } from "oh-vue-icons/icons/px";
import { HiSolidCheckCircle } from "oh-vue-icons/icons/hi";
import {SiOpenstreetmap} from "oh-vue-icons/icons/si"

import { VueQueryPlugin } from '@tanstack/vue-query'
import {MdCategoryOutlined} from "oh-vue-icons/icons/md";


addIcons(MdCategoryOutlined,SiOpenstreetmap,OiLocation,RiCalendarEventFill,FaSearch,FaTicketAlt,IoTicketSharp,IoArrowForwardOutline,FaTimes,PrSpinner,PxCalendarTomorrow,PxClock,PxGps,HiSolidCheckCircle);
const app = createApp(App)




app.use(VeeValidatePlugin);
app.use(createPinia());
app.use(VueQueryPlugin)
app.use(router);
app.use(registerLayouts);
app.component("v-icon", OhVueIcon);
app.mount('#app')
