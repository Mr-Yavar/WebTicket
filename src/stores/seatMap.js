import {defineStore} from "pinia";
import {useEventSource} from '@vueuse/core'
import useTicketStore from "@/stores/Ticket.js";
import {SEATMAP_SERVICE_BASE_URL} from "@/config/appConfig.js";
import {reactive, ref, watch} from "vue";
import useUserStore from "@/stores/user.js";

const useSeatMapStore = defineStore('SeatMap', () => {
    const user = useUserStore();
    const ticketStore = useTicketStore();
    const groupId = ref(undefined);

    const Locked_Tickets = reactive([]);

    // const seatMapService = new EventSource(SEATMAP_SERVICE_BASE_URL+"/seatmap-sse-endpoint?cid="+user.ClientId);
    const seatMapService = new useEventSource(SEATMAP_SERVICE_BASE_URL + "/seatmap-sse-endpoint?cid=" + user.ClientId, ['All_Locked_Tickets', 'Locked_Ticket', 'UnLocked_Ticket'])

    //['All_Locked_Tickets', 'Locked_Ticket', 'UnLocked_Ticket']
    function setLock(data) {


    }

    watch(seatMapService.data, () => {

        switch (seatMapService.event.value) {
            case "All_Locked_Tickets" :

                Locked_Tickets.splice(0, Locked_Tickets.length);
                Locked_Tickets.push(...JSON.parse(seatMapService.data.value));
                break;
            case "Locked_Ticket":
                Locked_Tickets.push(JSON.parse(seatMapService.data.value).Message);
                break;
            case "UnLocked_Ticket":
                let tmep = JSON.parse(seatMapService.data.value).Message;
                Locked_Tickets.splice(Locked_Tickets.findIndex(item => item === tmep), 1);
                break;
            default:
                break;
        }
    })

    //seatMapService.addEventListener("All_Locked_Tickets",setLock);


    async function talkToServer(url, {method = "GET", headers = {}}) {

        let res = await fetch(SEATMAP_SERVICE_BASE_URL + url, {
            method: method,
            headers: {

                ...headers
            }

        });

        if (!res.ok) {
            console.log(res.text());
            throw new Error("Error!");
        } else {
            if (res.status !== 204)
                return await res.text();
            else
                return;
        }


    }


    async function LeaveGroup() {
        if (groupId.value !== undefined)
            await talkToServer("/api/SeatMap/LeaveEvent/" + user.ClientId + "/" + groupId.value, {
                method: "GET",
                headers: {}
            });

        groupId.value = undefined;
        Locked_Tickets.splice(0, Locked_Tickets.length);

    }

    async function JoinGroup(group) {
        if (groupId.value !== undefined)
            return false;

        groupId.value = group;
        Locked_Tickets.splice(0, Locked_Tickets.length);
        talkToServer("/api/SeatMap/ChooseEvent/" + user.ClientId + "/" + group, {method: "GET", headers: {}});

    }

    return {groupId, LeaveGroup, JoinGroup, Locked_Tickets};
});

export default useSeatMapStore;