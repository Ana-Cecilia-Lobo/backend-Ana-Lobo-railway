import { UsersService } from "../repository/users.services.js";
import { CartsService } from "../repository/cart.services.js";
import { getUsersDto } from "../dao/dto/getUsers.dto.js";
import { logger } from "../utils/logger.js";
import { sendInactivityEmail } from "../utils/message.js";
import { stringify } from "uuid";

export class UsersController{

    static updateUser = async(req,res)=>{
        try{ 
            const userId = req.params.uid

            const user = await UsersService.getUserById(userId);
            if(!user){
                return res.send("El usuario no existe, <a href='/singup'>Registrarse</a>");
            }

            let rol;
            if(user.rol == "user" && user.status == "Completo"){
                rol = "premium"
            }else if(user.rol == "premium"){
                rol = "user"
            }else{
                return res.send("No puede realizar esta accion, <a href='/'>Volver al inicio</a>");
            }
            const newUser = {
                ...user,
                rol:rol
            };

            const update = await UsersService.updateUser(userId, newUser)

            res.send(update)

        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    }

    //para test
    static deleteUser = async(req,res)=>{
        try{ 
            const userId = req.params.uid

            const user = await UsersService.deleteUser(userId);
            res.send(user)

        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static uploadDocuments = async(req,res)=>{
        try{ 
            const userId = req.params.uid

            const user = await UsersService.getUserById(userId);
            if(!user){
                return res.send("El usuario no existe, <a href='/singup'>Registrarse</a>");
            }

            const identificacion = req.files["identificacion"]?.[0] || null;
            const domicilio = req.files["domicilio"]?.[0] || null;
            const estadoDeCuenta = req.files["estadoDeCuenta"]?.[0] || null;
            const docs = user.documents;
            if(identificacion){
                docs.push({name:"identificacion", reference:identificacion.filename})
            }
            if(domicilio){
                docs.push({name:"domicilio", reference: domicilio.filename})
            }
            if(estadoDeCuenta){
                docs.push({name:"estadoDeCuenta", reference: estadoDeCuenta.filename})
            }
            console.log(docs)
            
            user.documents = docs;
            const id = docs.some(e => e.name == 'identificacion');
            const dom = docs.some(e => e.name == 'domicilio');
            const est = docs.some(e => e.name == 'estadoDeCuenta');

            let complete = false
            if(id == true && dom == true && est == true){
                complete = true
            }

            if(complete){
                user.status = "Completo";
            } else {
                user.status = "Incompleto";
            }
            await UsersService.updateUser(user._id,user);
            res.json({status:"success", message:"solicitud procesada"});

        } catch (error) {
            console.log(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static getUsers = async(req,res)=>{
        try {
            
            const users = await UsersService.getUsers();
            console.log(users.length)
            let usersArray = [];
            for(let i = 0; i < users.length; i++ ){
                const usersInfo = new getUsersDto(users[i]);
                usersArray.push(usersInfo)
            }
            res.json(usersArray)
            
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
        
    }

    static deleteUsers = async(req,res)=>{
        try {
            const users = await UsersService.getUsers();

            let deleteUsers = [];
            for(let i = 0; i < users.length; i++ ){
                const user = users[i];

                const last_connection = user.last_connection
                const today = new Date()

                function sumarDias(fecha){
                    fecha.setDate(fecha.getDate() + 2);
                    return fecha;
                  }
                const connection = sumarDias(last_connection);

                if(connection < today){
                    deleteUsers.push(user)
                }
            }
            console.log(deleteUsers)

            if(deleteUsers.length <= 0){
                return res.json(`No se ha eliminado ningun usuario por inactividad`);
            }
            for(let i = 0; i < deleteUsers.length; i++ ){
                const user = deleteUsers[i];
                const id = JSON.stringify(user._id).replace('"', '').replace('"', '')

                const cartId = JSON.stringify(user.cart).replace('"', '').replace('"', '')
                const deletedcart = CartsService.deleteCart(cartId)
                const deleted = UsersService.deleteUserId(id);
                console.log(deleted, deletedcart)
                await sendInactivityEmail(user.email);    
            }
            res.json(`Se ha enviado un enlace a los correos para informarles sobre su inactividad.`)
            
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static updateAnUser = async(req,res)=>{
        try {
            const id = req.params.uid
            let rol = req.params.rol

            const user = await UsersService.getUserById(id);

            if(rol == "user"){
                rol = "premium"
            }else if(rol == "premium"){
                rol = "user"
            }
            const newUser = {
                ...user,
                rol:rol
            };

            const update = await UsersService.updateUser(id, newUser)
            res.json(update)

        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    }

    static deleteUserbyId = async(req,res)=>{
        try {
            const id = req.params.uid

            const user = await UsersService.getUserById(id);
            const cartId = JSON.stringify(user.cart).replace('"', '').replace('"', '')
            const deletedcart = CartsService.deleteCart(cartId)
            const deleteUser = await UsersService.deleteUserId(id)
            console.log(deleteUser, deletedcart)
            res.json({status:"correct", message:"usuario eliminado"})
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    }
}