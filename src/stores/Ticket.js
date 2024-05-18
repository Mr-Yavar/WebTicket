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

    function removeTicket(ticketId){
        let index = Tickets.findIndex(ticket=>ticket.id===ticketId);

        if(index!==-1)
            Tickets.splice(index,1);
    }

     function removeAllTickets(){
         Tickets.splice(0,Tickets.length);
     }

     function sumOfAllPrice(){
         return Tickets.reduce((price, item) => price += item.price, 0);
     }
    return {selectedShowing,setSelectedShowing,Tickets,addToTicket,removeTicket,removeAllTickets,sumOfAllPrice};
});

 export default useTicketStore;