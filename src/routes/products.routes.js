import {Router} from "express";
import { ProductsController } from "../controller/products.controller.js";
import { canUpdateProducts, canAddProducts, checkSession} from "../middlewares/auths.js";

const router = Router();

//Ruta principal api/products

//Obtener productos
router.get("/", checkSession, ProductsController.getProducts);

//Obtener productos por id
router.get("/:pid", checkSession, ProductsController.getProductsID);

//Agregar productos
router.post("/", checkSession, canAddProducts, ProductsController.addProducts);

//Modificar productos
router.put("/:pid", checkSession, canUpdateProducts, ProductsController.updateProducts);

//Eliminar productos
router.delete("/:pid", checkSession, canUpdateProducts, ProductsController.deleteProducts);


//Mocking
router.get("/mocking/mockingproducts", ProductsController.mocking);

export {router as ProductRouter};