import { CartsService } from "../repository/cart.services.js";
import { ProductsService } from "../repository/products.services.js";
import { TicketService } from "../repository/ticket.services.js";
import {v4 as uuidv4} from 'uuid';
import { logger } from "../utils/logger.js";

import { CustomError } from "../repository/error/customError.service.js";
import { EError } from "../enums/EError.js";


export class CartsController{
    static createCart = async(req, res)=>{
        try {
            const create = await CartsService.addCart();
            res.json({status:"success", data:create});
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    };

    static getCart = async(req,res)=>{
        try{
            const id = req.params.cid;
            if(id){
                const cartId = await CartsService.getCartById(id);
                if(!cartId){
                    CustomError.createError({
                        name: "Error al obtener el carrito",
                        cause: "Error",
                        message: "El carrito no pudo ser encontrado",
                        errorCode: EError.INVALID_JSON
                    });
                }
                res.json({status:"success", data: cartId});
            }else{
                CustomError.createError({
                    name: "Error al obtener el carrito",
                    cause: "Error",
                    message: "El id no es valido",
                    errorCode: EError.INVALID_PARAMS
                });
            } 
        }catch(error){
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    };

    static addProduct = async(req,res)=>{
        try {
            const cartId = req.params.cid;
            const productID = req.params.pid;
            const cart = await CartsService.getCartById(cartId);
            if(cart){
                const product = await ProductsService.getProductById(productID);
                if(product){
                    const addPtoC  = await CartsService.addProductToCart(cartId,productID);
                    if(!addPtoC){
                        CustomError.createError({
                            name: "Error al agregar el producto al carrito",
                            cause: "Error",
                            message: "Hubo un error al agregar el producto al carrito",
                            errorCode: EError.INVALID_JSON
                        });
                    }
                    res.json({status:"success", message:addPtoC});
                } else {
                    CustomError.createError({
                        name: "Error al agregar el producto al carrito",
                        cause: "Error",
                        message: "Producto no existe",
                        errorCode: EError.INVALID_JSON
                    });
                }
            } else {
                CustomError.createError({
                    name: "Error al obtener el carrito",
                    cause: "Error",
                    message: "El carrito no pudo ser encontrado",
                    errorCode: EError.INVALID_JSON
                });
            }
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    };

    static deleteProduct = async(req,res)=>{
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            
            const cart = await CartsService.getCartById(cartId);
            if(cart){
                const product = await ProductsService.getProductById(productId);
                if(product){
                    const deleteProduct  = await CartsService.deleteProducts(cartId,productId);
                    if(!deleteProduct){
                        CustomError.createError({
                            name: "Error al elinar el producto del carrito",
                            cause: "Error",
                            message: "Hubo un error al eliminar el producto del carrito",
                            errorCode: EError.INVALID_JSON
                        });
                    }
                    res.json({status:"success", message: deleteProduct});
                } else {
                    CustomError.createError({
                        name: "Error al eliminar el producto del carrito",
                        cause: "Error",
                        message: "Producto no existe",
                        errorCode: EError.INVALID_JSON
                    });
                }
            } else {
                CustomError.createError({
                    name: "Error al obtener el carrito",
                    cause: "Error",
                    message: "El carrito no pudo ser encontrado",
                    errorCode: EError.INVALID_JSON
                });
            }
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    };

    static updateCart = async(req,res)=>{
        try {
            const cartId = req.params.cid;
            if(cartId){
                const cart = await CartsService.updateCart(cartId);
                if(!cart){
                    CustomError.createError({
                        name: "Error al modificar el carrito",
                        cause: "Error",
                        message: "El carrito no pudo ser modificado",
                        errorCode: EError.INVALID_JSON
                    });
                }
                res.json({status:"success", message: cart});
            }else{
                CustomError.createError({
                    name: "Error al obtener el carrito",
                    cause: "Error",
                    message: "El id no es valido",
                    errorCode: EError.INVALID_PARAMS
                });
            }
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    };

    static updateQuantity = async(req,res)=>{
        try {
            const cartId = req.params.cid;
            const productID = req.params.pid;
            const quantity = req.body.quantity;
            const cart = await CartsService.getCartById(cartId);
            if(cart){
                const product = await ProductsService.getProductById(productID);
                if(product){
                    const updateQuantity = await CartsService.updateQuantity(cartId,productID,quantity);
                    if(!updateQuantity){
                        CustomError.createError({
                            name: "Error al modificar el producto del carrito",
                            cause: "Error",
                            message: "Hubo un error al modificar el producto del carrito",
                            errorCode: EError.INVALID_JSON
                        });
                    }
                    res.json({status:"success", message: updateQuantity});
                } else {
                    CustomError.createError({
                        name: "Error al eliminar el producto del carrito",
                        cause: "Error",
                        message: "Producto no existe",
                        errorCode: EError.INVALID_JSON
                    });
                }
            } else {
                CustomError.createError({
                    name: "Error al obtener el carrito",
                    cause: "Error",
                    message: "El carrito no pudo ser encontrado",
                    errorCode: EError.INVALID_JSON
                });
            }
        
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    };

    static deleteCart = async(req,res)=>{
        try {
            const cartId = req.params.cid;
            if(cartId){ 
                const deleteCart  = await CartsService.deleteCart(cartId);
                if(!deleteCart){
                    CustomError.createError({
                        name: "Error al eliminar el carrito",
                        cause: "Error",
                        message: "El carrito no pudo ser eliminado",
                        errorCode: EError.INVALID_JSON
                    });
                }
                res.json({status:"success", message:deleteCart});
            }else{
                CustomError.createError({
                    name: "Error al obtener el carrito",
                    cause: "Error",
                    message: "El id no es valido",
                    errorCode: EError.INVALID_PARAMS
                });
            } 
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    }; 

    static purchase = async(req,res)=>{
        try {
            const cartid = req.params.cid;
            if(cartid) {   
                const cart = await CartsService.getCartById(cartid);
                if(!cart){
                    CustomError.createError({
                        name: "Error al obtener el carrito",
                        cause: "Error",
                        message: "El carrito no existe",
                        errorCode: EError.INVALID_PARAMS
                    });
                }
                    if(cart.products.length){
                        let productsApproved = [];
                        let productsRejected = [];
                        for(let i=0; i<cart.products.length; i++){

                            const product = cart.products[i].productId;
                            const id = JSON.stringify(product._id).replace('"', '').replace('"', '')
                            const productQty = cart.products[i].quantity;

                            const productDB = await ProductsService.getProductById(id);
                            const productStock = productDB.stock;

                            if(productStock >= productQty){
                                const updateProduct = await ProductsService.updateProduct(id, {"stock": productStock-productQty});
                                logger.debug(updateProduct)
                                productsApproved.push(product.price*productQty);
                                const deleteProductCart = CartsService.deleteProducts(cartid, id)
                                logger.debug(deleteProductCart)
                            }else{
                                productsRejected.push(product);
                            }
                        }

                        const code = uuidv4();

                        let today = new Date();

                        let totalAmount = productsApproved.reduce((a, b) => a + b, 0);

                        const email = req.user.email;

                        const ticket = {code: code, purchase_datetime: today, amount: totalAmount, purchaser: email}

                        const createTicket  = await TicketService.createTicket(ticket);

                        if(!createTicket){
                            CustomError.createError({
                                name: "Error al crear el tick",
                                cause: "Error",
                                message: "Hubo un error al crear el ticket",
                                errorCode: EError.INVALID_PARAMS
                            });
                        }

                        logger.debug(createTicket)

                        if(productsRejected.length >= 1 && productsApproved.length < 1){
                            res.json({status:"error", message: "No se pudo procesar ningun producto"});
                        }else if(productsRejected.length >= 1 && productsApproved >= 1){
                            res.json({status:"success", message: "Compra finalizada con éxito, este es el ticket de su compra "+ createTicket + " Pero hubo " + productsRejected.length + " productos que no pudieron procesarse" });
                        }else{
                            res.json({status:"success", message: "Compra finalizada con éxito, este es el ticket de su compra"+ createTicket});
                        }
                        
                    }else{
                        res.status(400).json({status:"error", message:"el carrito no tiene productos"});
                    }
        }else{
            CustomError.createError({
                name: "Error al obtener el carrito",
                cause: "Error",
                message: "El id no es valido",
                errorCode: EError.INVALID_PARAMS
            });
        }    
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    }; 

}
