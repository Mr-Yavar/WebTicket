import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { v5 as uuidv5 } from 'uuid'
import { v4 as uuidv4 } from 'uuid'
const useUserStore = defineStore('user', () => {
    const expireTime = ref(localStorage.getItem('jwt') ? new Date(jwtDecode(localStorage.getItem('jwt')).exp * 1000) : new Date())
    const isAuthenticated = ref(expireTime.value > new Date())

    const accessToken = ref(localStorage.getItem('jwt') ?? '')
    const refreshToken = ref('')
    const user = ref(!localStorage.getItem('user') ? {} : { user: JSON.parse(localStorage.getItem('user')), Identity: accessToken.value ? jwtDecode(accessToken.value) : {} })
    const roles = ref( user.value?.Identity ?   ((user.value?.Identity["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) ? [(user.value?.Identity["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"])] : []) : []);

    const userId = ref(user.value?.Identity ?  (user.value?.Identity["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ?? null) : null);

    const ClientId = ref(localStorage.getItem('ClientId') ?? uuidv5(Math.random().toString(), uuidv4()))
    localStorage.setItem('ClientId', ClientId.value)
    async function logOut() {
        isAuthenticated.value = false;
        localStorage.removeItem('user');
        localStorage.removeItem('jwt');
        accessToken.value = null;
        refreshToken.value = null;
        user.value ={user:null,Identity:null};
        roles.value = [];
        userId.value = null;
        //location.reload();
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
            
            user.value.user = userData.user;
            user.value.Identity = jwtDecode(userData.accessToken);
            expireTime.value = new Date(user.value.Identity.exp * 1000);
            roles.value = [user.value.Identity["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]];
            userId.value =user.value.Identity["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            isAuthenticated.value = true
        } catch (e) {
            console.log(e)
            isAuthenticated.value = false
        }
        
    }

    return { isAuthenticated, user, accessToken, refreshToken, expireTime, ClientId, GetAuthenticated, logOut, FullName,roles,userId }
})
export default useUserStore
