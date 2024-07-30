import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { Guid } from '@/config/helper.js'
import { TicketsRepository } from '@/db/ticketsRepository.js'

const useTicketStore = defineStore('Ticket', () => {
    const ticketDB = new TicketsRepository()
    const selectedShowing = ref(localStorage.getItem('show') === null ? '' : new Guid({}).fromCompressedToFull(localStorage.getItem('show')))

    const Tickets = reactive([])

    async function initialize() {
        Tickets.splice(0, Tickets.length)
        let res = (await ticketDB.getTickets()) ?? []
        Tickets.push(...res)
    }
    function setSelectedShowing(showingId) {
        selectedShowing.value = showingId

        localStorage.setItem('show', new Guid({}).fromFullToCompressed(showingId))
    }

    function addToTicket(ticket) {
        ticketDB.addTicket(ticket.id, ticket)
        Tickets.push(ticket)
    }

    function removeTicket(ticketId) {
        let index = Tickets.findIndex((ticket) => ticket.id === ticketId)

        if (index !== -1) {
            Tickets.splice(index, 1)
            ticketDB.deleteTicket(ticketId)
        }
    }

    async function removeAllTickets() {
        Tickets.splice(0, Tickets.length)
        ;(await ticketDB.getTickets()).forEach((ticket) => {
            ticketDB.deleteTicket(ticket.id)
        })
    }

    function sumOfAllPrice() {
        return Tickets.reduce((price, item) => (price += item.price), 0)
    }
    return { initialize, selectedShowing, setSelectedShowing, Tickets, addToTicket, removeTicket, removeAllTickets, sumOfAllPrice }
})

export default useTicketStore
