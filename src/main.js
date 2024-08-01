import './assets/main.css'
import 'vue-select/dist/vue-select.css'
import 'tippy.js/dist/tippy.css' // optional for styling
import '@/assets/vpd.css'
import '@/assets/basic.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueTippy from 'vue-tippy'
import 'vue3-perfect-scrollbar/style.css'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import VeeValidatePlugin from './config/veevalidate.js'
import registerLayouts from '@/config/_registerLoayouts.js'

import { addIcons, OhVueIcon } from 'oh-vue-icons'


import { OiLocation } from 'oh-vue-icons/icons/oi'
import { RiCalendarEventFill,RiMenu2Line } from 'oh-vue-icons/icons/ri/index.js'
import { FaRegularStar, FaSearch, FaTicketAlt, FaTimes,FaChartPie } from 'oh-vue-icons/icons/fa/index.js'
import { IoSettingsOutline, IoGridOutline, IoDocumentsOutline, IoTicketSharp, IoArrowForwardOutline, IoTrashOutline, IoTicketOutline } from 'oh-vue-icons/icons/io/index.js'
import { PrSpinner } from 'oh-vue-icons/icons/pr'
import { PxCalendarTomorrow, PxClock, PxGps } from 'oh-vue-icons/icons/px'
import { HiChevronDown, HiQuestionMarkCircle, HiSolidCheckCircle, HiTable } from 'oh-vue-icons/icons/hi'
import { SiOpenstreetmap,  } from 'oh-vue-icons/icons/si'
import { MdCategoryOutlined, MdDashboardOutlined, MdDiscountTwotone, MdAttachmoneyOutlined } from 'oh-vue-icons/icons/md'
import { BiBarChartLine, BiPencil, BiShieldCheck, BiChevronLeft } from 'oh-vue-icons/icons/bi'
import { CoHeart,CoBell } from 'oh-vue-icons/icons/co/index.js'

import { LaFileInvoiceDollarSolid,LaTimesSolid,LaUserCircle } from 'oh-vue-icons/icons/la/index.js'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar'
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'

addIcons(LaFileInvoiceDollarSolid, IoTicketOutline, MdAttachmoneyOutlined, CoHeart, FaRegularStar, BiChevronLeft, HiChevronDown, BiShieldCheck, HiQuestionMarkCircle, RiMenu2Line, IoGridOutline, IoDocumentsOutline, FaChartPie, IoSettingsOutline, BiPencil, LaTimesSolid, MdDashboardOutlined, HiTable, CoBell, BiBarChartLine, FaSearch, LaUserCircle, MdDiscountTwotone, IoTrashOutline, MdCategoryOutlined, SiOpenstreetmap, OiLocation, RiCalendarEventFill, FaSearch, FaTicketAlt, IoTicketSharp, IoArrowForwardOutline, FaTimes, PrSpinner, PxCalendarTomorrow, PxClock, PxGps, HiSolidCheckCircle)

import DatePicker from '@alireza-ab/vue3-persian-datepicker'
const app = createApp(App)
app.component('AB-Date-Picker', DatePicker)
app.use(Vue3PersianDatetimePicker, {
    name: 'DateTimePicker',
    props: {
        format: 'YYYY-MM-DD HH:mm',
        displayFormat: 'jYYYY/jMM/jDD HH:mm',
        type: 'datetime',
        editable: true,
        placeholder: 'Please select a date',
        altFormat: 'YYYY-MM-DD HH:mm',
        color: '#1e88e5',
        autoSubmit: true,
        inputClass: ' outline-0 block text-sm '

        //...
        //... And whatever you want to set as default.
        //...
    }
})
app.directive('inline-svg', (el) => {
    console.log(el)
    if (!el) {
        return
    }

    // copy attributes to first child
    const content = el.tagName === 'TEMPLATE' ? el.content : el
    if (content.children.length === 1) {
        ;[...el.attributes].forEach((attr) => content.firstChild.setAttribute(attr.name, attr.value))
    }

    // replace element with content
    if (el.tagName === 'TEMPLATE') {
        el.replaceWith(el.content)
    } else {
        el.replaceWith(...el.children)
    }
})
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
            allowHTML: true
        } // => Global default options * see all props
    }
)
app.use(PerfectScrollbarPlugin, { componentName: 'Scrollbar' })
app.use(VeeValidatePlugin)
app.use(createPinia())
app.use(router)
app.use(registerLayouts)
app.component('v-icon', OhVueIcon)
app.mount('#app')
