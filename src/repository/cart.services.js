import {cartsDAO} from "../dao/factory.js"

export class CartsService{

    static async addCart(cart){
        return cartsDAO.addCart(cart);
    };

    static async getCartById(id){
        return cartsDAO.getCartById(id);
    };

    static async addProductToCart(cartId,productID){
        return cartsDAO.addProductToCart(cartId,productID);
    };

    static async deleteProducts(cartId,productID){
        return cartsDAO.deleteProducts(cartId,productID);
    };

    static async updateCart(cartId){
        return cartsDAO.updateCart(cartId);
    };

    static async updateQuantity(cartId,productID, quantity){
        return cartsDAO.updateQuantity(cartId,productID, quantity);
    };

    static async deleteCart(cartId){
        return cartsDAO.deleteCart(cartId);
    };

}