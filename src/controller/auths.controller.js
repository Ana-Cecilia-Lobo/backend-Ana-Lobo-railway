import { UsersService } from "../repository/users.services.js";
import { generateEmailToken, sendRecoveryEmail } from "../utils/message.js";
import { verifyEmailToken, isValidPassword, createHash } from "../utils.js";

export class SessionsController{
    static singUpExitoso = (req,res)=>{
        res.send('<div>usuario registrado, <a href="/login">ir al login</a></div>');
    };

    static singUpFailed = (req,res)=>{
        res.send('<div>Hubo un error al registrar el usuario, <a href="/singup">intente de nuevo</a></div>');
    };

    static logInExistoso = (req,res)=>{
        res.send('<div>usuario logueado, <a href="/profile">ir al perfil</a></div>')
        //res.redirect("/profile");
        
    };

    static logInFailed = (req,res)=>{
        res.send('<div>Hubo un error al loguear el usuario, <a href="/login">intente de nuevo</a></div>')
    };

    static singUpGitHub = (req,res)=>{
        res.redirect("/profile");
    }

    static logOut = (req,res)=>{
        req.logOut(error=>{
            if(error){
                return res.send('no se pudo cerrar sesion, <a href="/profile">ir al perfil</a>');
            } else {
                req.session.destroy(err=>{
                    if(err) return res.send('no se pudo cerrar sesion, <a href="/profile">ir al perfil</a>');
                    res.redirect("/")
                });
            }
        })
    };

    static sendRecovery = async(req,res)=>{
        const {email} = req.body;
        try {
            const user = await UsersService.getUserByEmail(email);
            if(user){
                const token = generateEmailToken(email,60*60)
                
                await sendRecoveryEmail(email,token);
                res.send("Se ha enviado un enlace a tu correo");
            }else{
                throw new Error("Email no válido")
            }
        } catch (error) {
            res.send({status:"error", message:error.message})
        }
    };

    static resetPassword = async(req,res)=>{
        try {
            const token = req.query.token;
            const {newPassword} = req.body;
            
            const userEmail = verifyEmailToken(token);
            if(!userEmail){
                return res.send("El enlace caduco, <a href='/forgot-password'>genera un nuevo enlace</a>");
            }
            
            const user = await UsersService.getUserByEmail(userEmail);
            if(!user){
                return res.send("El usuario no existe, <a href='/singup'>Registrarse</a>");
            }
            
            if(isValidPassword(newPassword,user)){
                return res.send("La contraseña no puede ser la misma");
            }

            const newUser = {
                ...user,
                password:createHash(newPassword)
            };

            const userUpdated = await UsersService.updateUser(user._id,newUser);
            console.log(userUpdated);
            res.redirect("/login");
        } catch (error) {
            res.send("No se pudo restablecer la contraseña");
        }
    }
}

