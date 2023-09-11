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
            return {status: "error", message: error.message }
        }
    }

    async getTicket(email){
        try {
            const ticket = await this.model.findOne({"purchaser":email}).sort({ "purchase_datetime": -1 }).lean()
            return ticket
            
        } catch (error) {
            return {status: "error", message: error.message }
        }
    }
}