import { PersianDate } from '@alireza-ab/vue3-persian-datepicker'

function dateToISO(dobj) {
    if (dobj.constructor?.name === 'Date') {
        const date = new Date(dobj * 1 + 210 * 60 * 1000)
        return date.toJSON()
    }
    throw new Error('the Object was not Date')
}

function persianStringToISO(str) {
    console.log(str)
    const temp = new PersianDate(str, 'jalali').toDate()
    const date = new Date(temp * 1 + 210 * 60 * 1000)
    return date.toJSON()
}

function persianStringToDate(str) {
    console.log(str)
    console.log(str, new PersianDate(str, 'jalali').toDate())
    return new PersianDate(str, 'jalali').toDate()
}

function gregorianStringToDate(str) {
    return new PersianDate(str).toDate()
}

export default { gregorianStringToDate, persianStringToDate, persianStringToISO, dateToISO }
