import {ticketsDao} from "../dao/factory.js"

export class TicketService{
    static async createTicket(ticket){
        return ticketsDao.createTicket(ticket);
    };
    
    static async getTicket(email){
        return ticketsDao.getTicket(email)
    };
}