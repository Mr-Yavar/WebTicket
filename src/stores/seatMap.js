import {defineStore} from "pinia";
import {v4 as uuidv4} from "uuid"
import { useEventSource } from '@vueuse/core'
import useTicketStore from "@/stores/Ticket.js";
import API_BASE_URL, {SEATMAP_SERVICE_BASE_URL} from "@/config/appConfig.js";
import {reactive, ref} from "vue";
import useUserStore from "@/stores/user.js";

const useSeatMapStore = defineStore('SeatMap',()=>{
    const user = useUserStore();
    const ticketStore = useTicketStore();
    const groupId = ref(undefined);

    const locked = reactive([]);

    const seatMapService = new EventSource(SEATMAP_SERVICE_BASE_URL+"/seatmap-sse-endpoint?cid="+user.ClientId)
    //['All_Locked_Tickets', 'Locked_Ticket', 'UnLocked_Ticket']
    function setLock(data){
        console.log(locked);
        locked.splice(0,locked.length);
        locked.push(...JSON.parse(data.data));
      
    }
    seatMapService.addEventListener("All_Locked_Tickets",setLock);



    async function talkToServer(url,{method = "GET",headers={}}){

        let res = await fetch(SEATMAP_SERVICE_BASE_URL+url,{
            method : method ,
            headers : {

                ...headers
            }

        });

        if(!res.ok){
            console.log(res.text());
            throw new Error("Error!");
        }else{
            if(res.status!==204)
                return await res.text();
            else
                return;
        }



    }


   async function LeaveGroup(){
        if(groupId.value===undefined)
            return true;

        talkToServer("")

    }
    async function JoinGroup(group){
        if(groupId.value!==undefined)
            return false;

        groupId.value = group;
        talkToServer("/api/SeatMap/ChooseEvent/"+user.ClientId+"/"+group,{method:"GET",headers:{}});

    }

    return {groupId,LeaveGroup,JoinGroup,locked};
});

export default useSeatMapStore;