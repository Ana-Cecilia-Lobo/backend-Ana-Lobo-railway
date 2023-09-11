import passport from "passport";
import localStrategy from "passport-local";
import githubStrategy from "passport-github2";

import { userModel } from "../dao/managers/mongo/models/user.models.js";
import { UserMongo } from "../dao/managers/mongo/Users.mongo.js";
import { CartsMongo } from "../dao/managers/mongo/CartManager.mongo.js";
import { createHash, isValidPassword } from "../utils.js";

const usersService = new UserMongo();
const manager = new CartsMongo();

export const initializePassport = ()=>{
    passport.use("signupStrategy",new localStrategy(
        {
            usernameField:"email", 
            passReqToCallback:true,
        },
        async(req, username, password, done)=>{
            try {
                console.log(req.file, "req.file")
                const {first_name,last_name} = req.body;
                const user = await usersService.getUserByEmail(username);
                if(user){
                    return done(null,false);
                }

                let rol = "user";
                if(username.endsWith("@coder.com")){
                    rol="admin";
                }

                let file;
                if(req.file == undefined){
                    file = "";
                }else{
                    file = req.file.filename;
                }
                const userCart = await manager.addCart();
                const newUser = {
                    first_name,
                    last_name,
                    email: username,
                    age: req.body.age,
                    password:createHash(password),
                    cart: userCart,
                    rol,
                    avatar: file
                };

                const createdUser = await usersService.saveUser(newUser);
                return done(null,createdUser);
            } catch (error) {
                return done(error);
            }
        }
    ));

    //extrategia de login
    passport.use("loginStrategy", new localStrategy(
        {
            usernameField:"email"
        },
        async(username, password, done)=>{
            try {
                const user = await usersService.getUserByEmail(username);
                
                if(!user){
                    return done(null,false);
                }
                //verificar la contraseña del usuario
                if(!isValidPassword(password,user)){
                    return done(null,false);
                }
                user.last_connection = new Date()
                await usersService.updateUser(user._id, user)
                return done(null,user);
            } catch (error) {
                return done(error);
            }
        }
    ));

//estrategia de registro con github
passport.use("githubSignup", new githubStrategy(
    {
        clientID:"Iv1.dc95194f2f9bcc63",
        clientSecret:"ccf40ca3dee2bda147e4aa69f15677b8c8089c5a",
        callbackUrl:"http://localhost:8080/api/sessions/github-callback"
    },
    async(accesstoken,refreshtoken,profile,done)=>{
        try {
            const user = await usersService.getUserByEmail(profile.username);
            const username = profile.username;
            if(!user){
                let role = "user";
                if(username.endsWith("@coder.com")){
                    role="admin";
                }

                const userCart = await manager.addCart();
                const newUser = {
                    first_name:profile.username,
                    last_name: "",
                    age: null,
                    email: profile.username,
                    password: createHash(profile.id),
                    cart: userCart,
                    role,
                }
                
                const createdUser = await usersService.saveUser(newUser);
                return done(null,createdUser);   
            } else {
                return done(null,false);
            }
        } catch (error) {
            return done(error);
        }
    }
));


    //serializacion y deserializacion
    passport.serializeUser((user,done)=>{
        done(null,user._id); 
    });

    passport.deserializeUser(async(id,done)=>{
        const user = await usersService.getUserById(id);
        done(null,user); 
    });
}