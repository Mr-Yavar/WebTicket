import {defineStore} from "pinia";
import {reactive, ref} from "vue";


 const useTicketStore = defineStore('Ticket',()=>{
    const selectedShowing = ref("");


    function setSelectedShowing(showingId){
        selectedShowing.value = showingId;
    }



    return {selectedShowing,setSelectedShowing};
});

 export default useTicketStore;