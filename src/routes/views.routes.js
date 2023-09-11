import {Router} from "express";
import { checkSession, canUpdateProducts, canChat, isAdmin } from "../middlewares/auths.js";
import { ViewsController } from "../controller/views.controller.js";
const router = Router();


router.get("/", checkSession, ViewsController.get);

router.get("/chat", checkSession, canChat, ViewsController.getChat);

router.get("/products", checkSession, ViewsController.getProducts)

router.get("/carts/:cid", checkSession, ViewsController.getCart);

router.get("/realtimeproducts", checkSession, ViewsController.getRealTimeProducts);

router.post("/realtimeproducts", canUpdateProducts, ViewsController.postRealTimeProducts);


router.get("/login", ViewsController.login);

router.get("/singup", ViewsController.singup);

router.get("/profile", checkSession, ViewsController.profile);

router.get("/user-cart", checkSession, ViewsController.getUserCart);

router.get("/userid", checkSession, ViewsController.getUserId);

router.get("/userrol", checkSession, ViewsController.getUserRol);

router.get("/ticket", checkSession,  ViewsController.getTicket);

router.get("/loggerTest", ViewsController.logger);

router.get("/forgot-password", ViewsController.forgotPass);

router.get("/reset-password", ViewsController.resetPass);

router.get("/update-users", checkSession, isAdmin, ViewsController.update_users)

export {router as viewsRouter};