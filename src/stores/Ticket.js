import {defineStore} from "pinia";
import {reactive, ref} from "vue";


 const useTicketStore = defineStore('Ticket',()=>{
    const selectedShowing = ref("");

    const Tickets = reactive([]);

    function setSelectedShowing(showingId){
        selectedShowing.value = showingId;
    }

    function addToTicket(ticket){

        Tickets.push(ticket);

    }

    function removeTicket(ticket){
        Tickets.splice(Tickets.indexOf(ticket),1);
    }

     function removeAllTickets(){
         Tickets.splice(0,Tickets.length);
     }

    return {selectedShowing,setSelectedShowing,Tickets,addToTicket,removeTicket,removeAllTickets};
});

 export default useTicketStore;