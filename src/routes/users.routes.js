import {Router} from "express";
import { UsersController } from "../controller/users.controller.js";
import { uploadUserDoc } from "../utils.js";
import { checkSession, isAdmin } from "../middlewares/auths.js";

const router = Router();

router.get("/premium/:uid", checkSession, UsersController.updateUser);

//test
router.delete("/delete-user", UsersController.deleteUser);

router.post("/:uid/documents", checkSession, uploadUserDoc.fields([{name:"identificacion",maxCount:1},{name:"domicilio",maxCount:1}, {name:"estadoDeCuenta",maxCount:1}]), UsersController.uploadDocuments)

router.get("/users", checkSession, isAdmin, UsersController.getUsers);

router.delete("/delete-users", checkSession, isAdmin, UsersController.deleteUsers)

router.put("/update-user/:uid/:rol", checkSession, isAdmin, UsersController.updateAnUser)

router.delete("/delete-a-user/:uid",checkSession, isAdmin, UsersController.deleteUserbyId)

export {router as UsersRouter};