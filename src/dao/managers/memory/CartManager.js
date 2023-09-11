import fs from 'fs'
import {__dirname} from '../../../utils.js'
import { configuracion } from '../../../config/config.js';
import path from "path";


export class CartManager{

    constructor(){
        this.path =  path.join(__dirname,`/dao/managers/memory/files/${configuracion.filesystem.carts}`);
    }

    fileExists(){
        return fs.existsSync(this.path);
    }

    generateId(carts){

        let newId;
        if(!carts.length){
            newId = 1;
        } else{
            newId = carts[carts.length-1].id+1;
        }
        return newId;
    }

    async addCart(){
        try {
            const cart={
                products:[]
            }
            if(this.fileExists()){

                const content = await fs.promises.readFile(this.path,"utf-8");
                const carts = JSON.parse(content);
                const cartId = this.generateId(carts);
                cart.id = cartId;

                carts.push(cart);
                await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2));
                return cart;
            }else{
                const cartId = this.generateId([]);
                cart.id = cartId;

                await fs.promises.writeFile(this.path,JSON.stringify([cart],null,2));
                return cart;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getCartById(id){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const carts = JSON.parse(content);
                const cart = carts.find(c=>c.id == id);
                if(cart){
                    return cart;
                } else {
                    throw new Error(`El carrito con el id ${id} no existe`);
                }
            } else {
                throw new Error("El archivo no existe");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async addProductToCart(cartId,productId){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const carts = JSON.parse(content);
                const cartI =carts.findIndex(prod=>prod.id === parseInt(cartId));
                if(cartI >= 0){
                    //Si el carrito existe
                    const productI = carts[cartI].products.findIndex(i=>i.product === parseInt(productId));
                    if(productI >= 0){
                        carts[cartI].products[productI]={
                            product: carts[cartI].products[productI].product,
                            quantity: carts[cartI].products[productI].quantity+1
                        }
                        await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2));
                        return carts[cartI].products
                    } else {
                        const newCartProduct={
                            product:parseInt(productId),
                            quantity:1
                        }
                        carts[cartI].products.push(newCartProduct);
                        await fs.promises.writeFile(this.path,JSON.stringify(carts,null,2));
                    }
                    return carts[cartI].products
                } else {
                    throw new Error(`El carrito no existe`);
                }
            } else {
                throw new Error("El archivo no existe");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

