import { userModel } from "./models/user.models.js";

export class UserMongo{
    constructor(){
        this.model=userModel;
    };

    async getUserByEmail(emailUser){
        try {
            const user = await this.model.findOne({email:emailUser});
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            return {status: "error", message: error.message }
        }
    };

    async getUserById(userId){
        try {
            const user = await this.model.findById(userId);
            if(!user){
                return 
            }
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            return {status: "error", message: error.message }
        }
    };

    async saveUser(user){
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            return {status: "error", message: error.message }
        }
    };

    async updateUser(userId,newInfo){
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId,newInfo,{new:true});
            if(!userUpdated){
                return
            }
            return userUpdated;
        } catch (error) {
            return {status: "error", message: error.message }
        }
    };

    async deleteUser(){
        try {
            await this.model.deleteOne({ "email" : "roberto@gmail.com" });
            return {message: "Usuario eliminado"};
        } catch (error) {
            return {status: "error", message: error.message }
        }
    }
    async getUsers(){
        try{  
            const users = await this.model.find().lean();
            return users; 
        }catch(error){
            return {status: "error", message: error.message }
        }
    }

    async deleteUserId(id){
        try{  
            const user = await this.model.findByIdAndDelete(id);
            return {message: "Usuario eliminado"};
        }catch(error){
            return {status: "error", message: error.message }
         }
    }
}