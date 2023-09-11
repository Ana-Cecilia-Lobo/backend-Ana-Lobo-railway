import {productDAO} from "../dao/factory.js"

export class ProductsService{
    static async getPaginate(query, options){
        return productDAO.getPaginate(query, options);
    }
    static async getProducts(){
        return productDAO.getProducts();
    };

    static async getProductById(id){
        return productDAO.getProductById(id);
    };

    static async createProduct(product){
        return productDAO.addProduct(product);
    };

    static async updateProduct(id,product){
        return productDAO.updateProduct(id,product);
    };

    static async deleteProduct(id){
        return productDAO.deleteProduct(id);
    };
};