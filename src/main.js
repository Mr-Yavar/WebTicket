import './assets/main.css'
import 'animate.css';
import 'vue-select/dist/vue-select.css';
import 'tippy.js/dist/tippy.css' // optional for styling

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueTippy from 'vue-tippy'

import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import VeeValidatePlugin from "./config/veevalidate.js";
import registerLayouts from "@/config/_registerLoayouts.js";
import {addIcons, OhVueIcon} from "oh-vue-icons";

import {OiLocation} from "oh-vue-icons/icons/oi";
import {RiCalendarEventFill} from "oh-vue-icons/icons/ri/index.js";
import {FaSearch, FaTicketAlt,FaTimes} from "oh-vue-icons/icons/fa/index.js";
import {IoTicketSharp, IoArrowForwardOutline, IoTrashOutline} from "oh-vue-icons/icons/io/index.js";
import {PrSpinner} from "oh-vue-icons/icons/pr";
import { PxCalendarTomorrow,PxClock,PxGps    } from "oh-vue-icons/icons/px";
import { HiSolidCheckCircle } from "oh-vue-icons/icons/hi";
import {SiOpenstreetmap} from "oh-vue-icons/icons/si"
import {MdCategoryOutlined,MdDiscountTwotone} from "oh-vue-icons/icons/md";

addIcons(MdDiscountTwotone,IoTrashOutline,MdCategoryOutlined,SiOpenstreetmap,OiLocation,RiCalendarEventFill,FaSearch,FaTicketAlt,IoTicketSharp,IoArrowForwardOutline,FaTimes,PrSpinner,PxCalendarTomorrow,PxClock,PxGps,HiSolidCheckCircle);

const app = createApp(App)


app.directive('inline-svg', el => {
    console.log(el);
    if (!el) {
        return
    }

    // copy attributes to first child
    const content = el.tagName === 'TEMPLATE' ? el.content : el
    if (content.children.length === 1) {
        [...el.attributes].forEach((attr) => content.firstChild.setAttribute(attr.name, attr.value));
    }

    // replace element with content
    if (el.tagName === 'TEMPLATE') {

        el.replaceWith(el.content)
    } else {
        el.replaceWith(...el.children)
    }
});
app.use(VueQueryPlugin)
app.use(
    VueTippy,
    // optional
    {
        directive: 'tippy', // => v-tippy
        component: 'tippy', // => <tippy/>
        componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
        defaultProps: {
            placement: 'auto-end',
            allowHTML: true,
        }, // => Global default options * see all props
    }
)

app.use(VeeValidatePlugin);
app.use(createPinia());
app.use(router);
app.use(registerLayouts);
app.component("v-icon", OhVueIcon);
app.mount('#app')
