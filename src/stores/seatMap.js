import { defineStore } from 'pinia'
import { useEventSource } from '@vueuse/core'
import useTicketStore from '@/stores/Ticket.js'
import { SEATMAP_SERVICE_BASE_URL } from '@/config/appConfig.js'
import { reactive, ref, watch } from 'vue'
import useUserStore from '@/stores/user.js'
import { useMutation } from '@tanstack/vue-query'
import Swal from 'sweetalert2'

const useSeatMapStore = defineStore('SeatMap', () => {
    const user = useUserStore()
    const TicketStore = useTicketStore()
    const groupId = ref(undefined)
    const seatMapMutate = useMutation({
        mutationKey: ['seatMapMutate'],
        mutationFn: async (variables) => {
            
                let res = await fetch(variables[0], {
                    headers: { ...variables[1].headers },
                    method: variables[1].method,
                    body: !variables[1].body ? null : JSON.stringify(variables[1].body)
                })

                if (!res.ok) {
                    throw new Error(await res.text())
                } else {
                    let data = await res.text()

                    if (data.length !== 0) return JSON.parse(data)
                    else return data
                }
          
        }
    })

    async function notifyLockTickets() {
        if (TicketStore.selectedShowing === '' || TicketStore.Tickets.length === 0) return
        await seatMapMutate.mutateAsync(
            [
                SEATMAP_SERVICE_BASE_URL + '/api/SeatMap/LockTickets?EventId=' + TicketStore.selectedShowing,
                {
                    method: 'POST',
                    body: [...TicketStore.Tickets.map((ticket) => ticket.id)],
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }
            ],
            {
                onError: (error, variables, context) => {
                    Swal.fire({
                        title: 'خطا !',
                        text: 'ارتباط به سرویس قطع شده است',
                        icon: 'error',
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 2000,
                        timerProgressBar: true,
                        showClass: { popup: 'direction-rtl vazir-font' }
                    })
                    console.log(error, variables, context)
                    throw new Error()
                },
                onSuccess: () => {}
            }
        )
    }
    async function notifyUnLockTickets() {
        if (TicketStore.selectedShowing === '' || TicketStore.Tickets.length === 0) return

        await seatMapMutate.mutateAsync(
            [
                SEATMAP_SERVICE_BASE_URL + '/api/SeatMap/UnLockTickets?EventId=' + TicketStore.selectedShowing,
                {
                    method: 'POST',
                    body: [...TicketStore.Tickets.map((ticket) => ticket.id)],
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }
            ],
            {
                onError: (error, variables, context) => {
                    Swal.fire({
                        title: 'خطا !',
                        text: 'ارتباط به سرویس قطع شده است',
                        icon: 'error',
                        showConfirmButton: false,
                        showCloseButton: true,
                        timer: 2000,
                        timerProgressBar: true,
                        showClass: { popup: 'direction-rtl vazir-font' }
                    })
                    console.log(error, variables, context)
                    throw new Error()
                },
                onSuccess: () => {
                    JoinGroup(TicketStore.selectedShowing)
                }
            }
        )
    }
    const Locked_Tickets = ref([])
    const UnLocked_Tickets = ref([])
    // const seatMapService = new EventSource(SEATMAP_SERVICE_BASE_URL+"/seatmap-sse-endpoint?cid="+user.ClientId);
    const seatMapService = new useEventSource(SEATMAP_SERVICE_BASE_URL + '/seatmap-sse-endpoint?cid=' + user.ClientId, ['All_Locked_Tickets', 'Locked_Ticket', 'UnLocked_Ticket'])
    //['All_Locked_Tickets', 'Locked_Ticket', 'UnLocked_Ticket']

    watch([seatMapService.lastEventId, seatMapService.data, seatMapService.event,seatMapService], () => {
        console.log(seatMapService.lastEventId, seatMapService.data, seatMapService.event);
        switch (seatMapService.event.value) {
            case 'All_Locked_Tickets':
                console.log( Locked_Tickets.value,seatMapService.data.value)
                Locked_Tickets.value = [...JSON.parse(seatMapService.data.value)];
            
                break
            case 'Locked_Ticket':
                Locked_Tickets.value = JSON.parse(seatMapService.data.value).Message;
                break
            case 'UnLocked_Ticket':{

                const unlocked = JSON.parse(seatMapService.data.value).Message;
                for (let id of unlocked) {
                    let index = Locked_Tickets.value.findIndex((x) => x === id)
                    if (index !== -1) Locked_Tickets.value.splice(index, 1)
                }

              
                UnLocked_Tickets.value = [...unlocked];
            }
                break;
            default:
                break
        }
    })

    //seatMapService.addEventListener("All_Locked_Tickets",setLock);

    async function talkToServer(url, { method = 'GET', headers = {} }) {
        let res = await fetch(SEATMAP_SERVICE_BASE_URL + url, {
            method: method,
            headers: {
                ...headers
            }
        })

        if (!res.ok) {
            console.log(res.text())
            throw new Error('Error!')
        } else {
            if (res.status !== 204) return await res.text()
            else return
        }
    }

    async function LeaveGroup() {
        if (groupId.value !== undefined)
            await talkToServer('/api/SeatMap/LeaveEvent/' + user.ClientId + '/' + groupId.value, {
                method: 'GET',
                headers: {}
            })

        groupId.value = undefined
        Locked_Tickets.value = [];
    }

    async function JoinGroup(group) {
        
        if (groupId.value !== undefined) return false
        Locked_Tickets.value = []
        groupId.value = group
        console.log(group);
        const res = await talkToServer('/api/SeatMap/ChooseEvent/' + user.ClientId + '/' + group, { method: 'GET', headers: {} });
        const msg = JSON.parse(res);
   
        Locked_Tickets.value = [...JSON.parse(msg.data)];
    }

    return { groupId, LeaveGroup, JoinGroup, notifyLockTickets, notifyUnLockTickets, Locked_Tickets, UnLocked_Tickets }
})

export default useSeatMapStore
