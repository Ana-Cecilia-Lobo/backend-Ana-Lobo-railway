import { chatModel } from "./models/chat.model.js";

export class ChatMongo{
    constructor(){
        this.model = chatModel;
    };

    async addMessage(message){
        try {
            const data = await this.model.create(message);
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            return {status: "error", message: error.message }
        }
    };

    async getMessages(){
        try {
            const data = await this.model.find();
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            return {status: "error", message: error.message }
        }
    };
}