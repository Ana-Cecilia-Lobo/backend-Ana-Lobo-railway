import fs from 'fs'
import {__dirname} from '../../../utils.js';
import path from "path";

export class ProductManager{

    constructor(){
        this.path = path.join(__dirname,`/dao/managers/memory/files/${options.filesystem.products}`);
    }

    fileExists(){
        return fs.existsSync(this.path);
    }

    async getProducts(){ 
        try{
            if(this.fileExists()){
                const contenido = await fs.promises.readFile(this.path,"utf-8");
                const contenidoJson = JSON.parse(contenido);
                return contenidoJson;
            }else{
                throw new Error("El archivo no existe");
            }
        }catch(error){
            throw new Error(error.message);
        }
    }

    async getProductById(id){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                const product = products.find(prod=>prod.id == id);
                if(product){
                    return product;
                } else {
                    throw new Error(`El producto con el id ${id} no existe`);
                }
            } else {
                throw new Error("El archivo no existe");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    generateId(products){
        let newId;
        if(!products.length){
            newId = 1;
        } else{
            newId = products[products.length-1].id+1;
        }
        return newId;
    }

    async addProduct(product){
        try {
            if(this.fileExists()){

                const verifyKeys = Object.keys(product);
                const verifyValues = Object.values(product);

                const thumbnails = verifyKeys.includes("thumbnails");
                let includesKeys;
                if(thumbnails){
                    const keys = ['title', 'description','code','price','status','stock', 'category', 'thumbnails'];
                    verifyKeys.sort();
                    keys.sort();
                    includesKeys = keys.every(function(v,i) { return v === verifyKeys[i] } );
                }else{
                    const keys = ['title', 'description','code','price','status','stock', 'category'];
                    verifyKeys.sort();
                    keys.sort();
                    includesKeys = keys.every(function(v,i) { return v === verifyKeys[i] } );
                }

                const includesValues =  verifyValues.includes("");

                if(includesKeys === true && includesValues === false){

                    const content = await fs.promises.readFile(this.path,"utf-8");
                    const products = JSON.parse(content);
                    const productId = this.generateId(products);
                    product.id = productId;

                    //Verificar que el producto no se repita
                    let repeat = false;
                    products.forEach(prod => {
                        if (prod.code === product.code) {
                            repeat = true;
                        }
                    });

                    if(repeat == true){
                        throw new Error("El producto ya existe")
                    }

                    products.push(product);
                    await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
                    return product;
                }else{
                    throw new Error("Hay campos vacíos")
                }
            }else{
                //Verificar que los campos esten completos
                const verifyKeys = Object.keys(product);
                const verifyValues = Object.values(product);

                const thumbnails = verifyKeys.includes("thumbnails");
                let includesKeys;
                if(thumbnails){
                    const keys = ['title', 'description','code','price','status','stock', 'category', 'thumbnails'];
                    verifyKeys.sort();
                    keys.sort();
                    includesKeys = keys.every(function(v,i) { return v === verifyKeys[i] } );
                }else{
                    const keys = ['title', 'description','code','price','status','stock', 'category'];
                    verifyKeys.sort();
                    keys.sort();
                    includesKeys = keys.every(function(v,i) { return v === verifyKeys[i] } );
                }

                const includesValues =  verifyValues.includes("");

                if(includesKeys == true && includesValues == false){
                    const productId = this.generateId([]);
                    product.id = productId;
                    await fs.promises.writeFile(this.path,JSON.stringify([product],null,2));
                    return product;
                }else{
                    throw new Error("Hay campos vacíos")
                }
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProduct(id, product){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                const productIndex = products.findIndex(prod=>prod.id == id);
                if(productIndex >= 0){
                    products[productIndex] ={
                        ...products[productIndex],
                        ...product
                    }
                    const productId = products[productIndex].id;
                    if(id == productId){
                        await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
                        return products[productIndex];
                    }else{
                        throw new Error("No se puede modificar el id");
                    }

                } else {
                    throw new Error(`El producto con el id ${id} no existe`);
                }
            } else {
                throw new Error("El archivo no existe");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProduct(id){
        try {
            if(this.fileExists()){
                const content = await fs.promises.readFile(this.path,"utf-8");
                const products = JSON.parse(content);
                const productIndex = products.findIndex(prod=>prod.id == id);
                if(productIndex >= 0){
                    products.splice(productIndex, 1);
                    await fs.promises.writeFile(this.path,JSON.stringify(products,null,2));
                    return id;
                } else {
                    throw new Error(`El producto con el id ${id} no existe`);
                }
            } else {
                throw new Error("El archivo no existe");
            }
        } catch (error) {
            throw new Error(error.message);
        }

    }
}   

//const manager = new ProductManager("../files/products.json");

const fucnionPrincipal= async ()=>{

    try{
        //const productAdded = await manager.addProduct({title: '22',description: '3',code: '4', price: '5',status: '6', stock: '6',category: '6',thumbnails: ''});
        //console.log("productAdded: ", productAdded);

        
        //const getProducts2 = await manager.getProducts();
        //console.log("Productos: ", getProducts2);

    }catch(error){
        //console.log(error.message);
    }
}

fucnionPrincipal();
