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
            throw error;
        }
    };

    async getUserById(userId){
        try {
            const user = await this.model.findById(userId);
            if(!user){
                throw new Error("El usuario no existe");
            }
            return JSON.parse(JSON.stringify(user));
        } catch (error) {
            throw error;
        }
    };

    async saveUser(user){
        try {
            const userCreated = await this.model.create(user);
            return userCreated;
        } catch (error) {
            throw error;
        }
    };

    async updateUser(userId,newInfo){
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId,newInfo,{new:true});
            if(!userUpdated){
                throw new Error("usuario no encontrado");
            }
            return userUpdated;
        } catch (error) {
            throw error;
        }
    };

    async deleteUser(){
        try {
            await this.model.deleteOne({ "email" : "roberto@gmail.com" });
            return {message: "Usuario eliminado"};
        } catch (error) {
            return
        }
    }
    async getUsers(){
        try{  
            const users = await this.model.find().lean();
            return users; 
        }catch(error){
            throw new Error(`Error al capturar los productos ${error.message}`);
        }
    }

    async deleteUserId(id){
        try{  
            const user = await this.model.findByIdAndDelete(id);
            return {message: "Usuario eliminado"};
        }catch(error){
            return error
        }
    }
}