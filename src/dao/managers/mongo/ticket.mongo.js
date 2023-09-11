import { ticketsModel } from "./models/tickets.model.js";

export class Tickets{

    constructor(){
        this.model = ticketsModel;
    }

    async createTicket(ticket){
        try {

            const data = await this.model.create(ticket);
            return data;
           
        } catch (error) {
            throw new Error(`Error al crear el ticket ${error.message}`);
        }
    }

    async getTicket(email){
        try {
            const ticket = await this.model.findOne({"purchaser":email}).sort({ "purchase_datetime": -1 }).lean()
            return ticket
            
        } catch (error) {
            return
        }
    }
}