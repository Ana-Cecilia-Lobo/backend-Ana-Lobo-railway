import { ProductsService } from "../repository/products.services.js";
import { UsersService } from "../repository/users.services.js";
import { generateProduct } from "../utils.js";
import { logger } from "../utils/logger.js";
import { sendDeletedProductEmail } from "../utils/message.js";

import { CustomError } from "../repository/error/customError.service.js";//estructura standard del error
import { EError } from "../enums/EError.js";//tipos de errores

export class ProductsController{

    static getProducts = async(req,res)=>{
        try {  
            const {limit=10,page=1,sort,category,stock} = req.query;

            if(sort){
                if(!["asc","desc"].includes(sort)){
                    CustomError.createError({
                        name: "Error al obtener productos",
                        cause: "Error",
                        message: "Ordenamiento no válido, solo puede ser asc o desc",
                        errorCode: EError.INVALID_PARAMS
                    });
                }
            }
                
            const sortValue = sort === "asc" ? 1 : -1;
            const stockValue = stock === 0 ? undefined : parseInt(stock);

            let query = {};

            if(category && stock){
                query = {category: category, stock: stockValue}
            }else{
                if(category || stockValue){
                    if(category){
                        query={category: category}
                    }else{
                        query={stock: stockValue}
                    }
                }
            }

            const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

        
            const result = await ProductsService.getPaginate(query, {
                page,
                limit,
                sort:{price: sortValue},
                lean:true
            });
            
        
            const response ={
                status:"success",
                payload:result.docs,
                totalPages:result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page:result.page,
                hasPrevPage:result.hasPrevPage,
                hasNextPage:result.hasNextPage,
                prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null,
            }
            logger.debug("response: ", response);
            res.json(response)
        } catch (error) {
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        }
    }
    
    static getProductsID = async(req,res)=>{
        try{
            const id = req.params.pid;
            if(id){
                const productId = await ProductsService.getProductById(id);
                if(!productId){
                    CustomError.createError({
                        name: "Error al obtener el producto",
                        cause: "Error",
                        message: "El producto no pudo ser encontrado",
                        errorCode: EError.INVALID_JSON
                    });
                }
                res.json({status:"success", data: productId});
            }else{
                CustomError.createError({
                    name: "Error al obtener el producto",
                    cause: "Error",
                    message: "El id no es un numero",
                    errorCode: EError.INVALID_PARAMS
                });
            } 
        }catch(error){
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
        } 
    };

    static addProducts = async(req,res)=>{
        try{
            const product = req.body;
            const add = await ProductsService.createProduct(product);
            if(!add){
                CustomError.createError({
                    name: "Error al crear el producto",
                    cause: "Error",
                    message: "Faltan campos obligatorios",
                    errorCode: EError.INVALID_JSON
                });
            }
            res.json({status:"success", data: product});
        }catch(error){
            logger.error(error.message)
            res.status(400).json({status:"error", message:error.message});
            
        }
    };

    static updateProducts = async(req, res)=>{
        try{
            const product = req.body;
            const id = req.params.pid;
            if(id){
                const update = await ProductsService.updateProduct(id, product);
                if(!update){
                    CustomError.createError({
                        name: "Error al actualizar el producto",
                        cause: "Error",
                        message: "El producto no existe",
                        errorCode: EError.INVALID_JSON
                    });
                }
                res.json({status: "success", data: update})
            }else{
                CustomError.createError({
                    name: "Error al actualizar el producto",
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

    static deleteProducts = async(req, res)=>{
        try{
            const id = req.params.pid;
            if(id){
                const product = await ProductsService.getProductById(id)
                const owner = JSON.stringify(product.owner).replace('"', '').replace('"', '');
                const user =  await UsersService.getUserById(owner)
                const deleteProduct = await ProductsService.deleteProduct(id);
                if(!deleteProduct){
                    CustomError.createError({
                        name: "Error al eliminar el producto",
                        cause: "Error",
                        message: "No se pudo eliminar el producto",
                        errorCode: EError.INVALID_JSON
                    });
                }
                await sendDeletedProductEmail(user.email);   
                res.json({status: "success", data: "Se ha eliminado el producto con el id: " + deleteProduct})
            }else{
                CustomError.createError({
                    name: "Error al actualizar el producto",
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

    static mocking = async(req, res)=>{
        try {
            let mocks = []
            for(let i=0;i<101;i++){
                const productMock = generateProduct();
                mocks.push(productMock);
            }
            res.json({status:"success", data:mocks});
            
        } catch (error) {
            logger.error(error.message)
            res.json({status:"error", data: error.message});
        }
        
    }
}