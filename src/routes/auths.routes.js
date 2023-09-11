import { Router } from "express";
import passport from "passport";
import { SessionsController } from "../controller/auths.controller.js";
import { uploadProfile } from "../utils.js";
const router = Router();


//registro
router.post("/signup", uploadProfile.single("avatar"), passport.authenticate("signupStrategy",{
    failureRedirect:"/api/sessions/signup-failed"
}) , SessionsController.singUpExitoso);

router.get("/signup-failed", SessionsController.singUpFailed);

//iniciar sesion
router.post("/login", passport.authenticate("loginStrategy",{
    failureRedirect:"/api/sessions/login-failed"
}) , SessionsController.logInExistoso);

router.get("/login-failed", SessionsController.logInFailed);


//ruta para registro con github
router.get("/github", passport.authenticate("githubSignup"));

router.get("/github-callback",
    passport.authenticate("githubSignup",{
        failureRedirect:"/api/sessions/signup-failed"
    }), SessionsController.singUpGitHub
);

//cerrar sesion
router.get("/logout", SessionsController.logOut);

//recuperar contraseña
router.post("/forgot-password", SessionsController.sendRecovery);

router.post("/reset-password", SessionsController.resetPassword);

export {router as authRouter};