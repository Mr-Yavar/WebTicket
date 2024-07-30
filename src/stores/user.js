import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { v5 as uuidv5 } from 'uuid'
import { v4 as uuidv4 } from 'uuid'
const useUserStore = defineStore('user', () => {
    const isAuthenticated = ref(!!localStorage.getItem('jwt'))

    const accessToken = ref(localStorage.getItem('jwt') ?? '')
    const refreshToken = ref('')
    const user = ref(!localStorage.getItem('user') ? {} : { user: JSON.parse(localStorage.getItem('user')), Identity: accessToken.value ? jwtDecode(accessToken.value) : {} })
    const expireTime = ref(new Date())
    const ClientId = ref(localStorage.getItem('ClientId') ?? uuidv5(Math.random().toString(), uuidv4()))
    localStorage.setItem('ClientId', ClientId.value)
    async function logOut() {
        isAuthenticated.value = false
        localStorage.removeItem('user')
        localStorage.removeItem('jwt')
    }

    const FullName = computed(() => {
        if (user.value.user?.lastName !== '' && user.value.user?.firstName !== '') return user.value.user?.firstName + ' ' + user.value.user?.lastName
        else return false
    })

    async function GetAuthenticated(userData) {
        localStorage.setItem('jwt', userData.accessToken)
        localStorage.setItem('user', JSON.stringify(userData.user))
        try {
            accessToken.value = userData.accessToken
            refreshToken.value = userData.refreshToken
            expireTime.value = userData.expireTime
            user.value.user = userData.user
            user.value.Identity = jwtDecode(userData.accessToken)
            isAuthenticated.value = true
        } catch (e) {
            isAuthenticated.value = false
        }
        console.log(user)
    }

    return { isAuthenticated, user, accessToken, refreshToken, expireTime, ClientId, GetAuthenticated, logOut, FullName }
})
export default useUserStore
