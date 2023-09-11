import {Router} from "express";
import {CartsController} from "../controller/carts.controller.js";
import {ownCart, addOwnProduct, checkSession} from "../middlewares/auths.js"

const router = Router();

//Ruta principal api/cart


router.post("/", CartsController.createCart);

router.get("/:cid", checkSession, ownCart, CartsController.getCart);

router.post("/:cid/product/:pid", checkSession, ownCart, addOwnProduct, CartsController.addProduct);

router.delete("/:cid/product/:pid", ownCart, CartsController.deleteProduct);

router.put("/:cid", checkSession, CartsController.updateCart);

router.put("/:cid/product/:pid", checkSession, ownCart, addOwnProduct, CartsController.updateQuantity);

router.delete("/:cid", checkSession, ownCart, CartsController.deleteCart);

router.post("/:cid/purchase", checkSession, ownCart, CartsController.purchase)

export {router as CartRouter};