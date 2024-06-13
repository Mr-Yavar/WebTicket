import {computed, reactive, ref} from 'vue'
import {defineStore} from 'pinia'
import {jwtDecode} from "jwt-decode";
import { v5 as uuidv5 } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
const useUserStore = defineStore('user', () => {
    const isAuthenticated = ref(false);
    const user = ref({});
    const accessToken = ref("");
    const refreshToken = ref("");
    const expireTime = ref(new Date());
    const ClientId = ref(localStorage.getItem("ClientId") ?? uuidv5(Math.random().toString(),uuidv4()));
    localStorage.setItem("ClientId",ClientId.value);
    async function logOut(){
        isAuthenticated.value=false;
    }

    const FullName = computed(() => {
        if (user.value.lastName !== "" && user.value.firstName !== "")
            return user.value?.firstName + " " + user.value?.lastName;
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

    return {isAuthenticated,user,accessToken,refreshToken,expireTime,ClientId, GetAuthenticated,logOut,FullName}
})
export default useUserStore;