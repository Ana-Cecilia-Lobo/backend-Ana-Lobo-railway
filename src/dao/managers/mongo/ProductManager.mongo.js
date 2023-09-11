import { productsModel } from "./models/products.model.js";

export class ProductsMongo{
    
    constructor(){
        this.model = productsModel;
    }

    async getPaginate(query={}, options={}){
        try {
            const result = await this.model.paginate(query, options);
            return result;
        } catch (error) {
            throw new Error(`Error al capturar los productos`)
        }

    }

    async getProducts(){ 
        try{  
            const products = await this.model.find().lean();
            return products; 
        }catch(error){
            throw new Error(`Error al capturar los productos ${error.message}`);
        }
    }

    async getProductById(id){
        try {
            const product = await this.model.findById(id);
            if(product){
                return product;
            }else{
                return
            }
        } catch (error) {
            return error
        }
    }

    async addProduct(product){
        try {
           const data = await this.model.create(product);
            return data;
        } catch (error) {
            return error
        }
    }

    async updateProduct(id,product){
        try {
            const data = await this.model.findByIdAndUpdate(id,product,{new:true});
            if(!data){
                return
            }
            return data;
        } catch (error) {
            return error
        }
    }

    async deleteProduct(id){
        try {
            await this.model.findByIdAndDelete(id);
            return {message: "Producto eliminado"};
        } catch (error) {
            return error
        }
    };

}