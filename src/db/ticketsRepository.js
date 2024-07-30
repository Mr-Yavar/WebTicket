import Dexie from 'dexie'
import { decryptData, encryptData } from '@/utils/Crypto.js'

export class TicketsRepository extends Dexie {
    constructor() {
        super('database')
        this.version(1).stores({
            tickets: 'id,content'
        })

        this.tickets = this.table('tickets')
    }

    async getTickets() {
        console.log(await this.tickets.toCollection().toArray())
        return (await this.tickets.toCollection().toArray())?.map((x) => JSON.parse(decryptData(x.content)))
    }

    updateTicket(id, ticket) {
        return this.tickets.update(id, { content: encryptData(JSON.stringify(ticket)) }) ?? []
    }

    addTicket(id, ticket) {
        return this.tickets.add({ id, content: encryptData(JSON.stringify(ticket)) })
    }

    deleteTicket(id) {
        return this.tickets.delete(id)
    }
}
