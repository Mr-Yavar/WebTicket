import {computed, reactive, ref} from 'vue'
import {defineStore} from 'pinia'
import {jwtDecode} from "jwt-decode";

const useUserStore = defineStore('user', () => {
    const isAuthenticated = ref(false);
    const user = ref({});
    const accessToken = ref("");
    const refreshToken = ref("");
    const expireTime = ref(new Date());

    async function logOut(){
        isAuthenticated.value=false;
    }

    const FullName = computed(() => {
        if (user.value.lastName !== "" && user.value.firstName !== "")
            return user.value.firstName + " " + user.value.lastName;
        else
            return false;
    });

    async function GetAuthenticated(userData) {

        try {
            accessToken.value = userData.accessToken;
            refreshToken.value = userData.refreshToken;
            expireTime.value = userData.expireTime;
            user.value = userData.user;
            user.value.Identity = jwtDecode(userData.accessToken);
            isAuthenticated.value = true;
        } catch (e) {
            isAuthenticated.value = false;
        }
        console.log(user);
    }

    return {isAuthenticated,user,accessToken,refreshToken,expireTime, GetAuthenticated,logOut,FullName}
})
export default useUserStore;