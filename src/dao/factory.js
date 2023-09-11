import { configuracion } from "../config/config.js";

let cartsDAO;
let chatDAO;
let productDAO;
let usersDAO;
let ticketsDao
const PERSISTENCE = configuracion.server.persistence;

switch (PERSISTENCE) {
    case "mongo":
        const {connectDB} = await import("../config/dbConnection.js");
        connectDB();
        const {CartsMongo} = await import("./managers/mongo/CartManager.mongo.js");
        const {ChatMongo} = await import("./managers/mongo/chat.mongo.js");
        const {ProductsMongo} = await import("./managers/mongo/ProductManager.mongo.js");
        const {UserMongo} = await import("./managers/mongo/Users.mongo.js");
        const {Tickets} = await import("./managers/mongo/ticket.mongo.js");
        cartsDAO = new CartsMongo();
        chatDAO = new ChatMongo();
        productDAO = new ProductsMongo();
        usersDAO = new UserMongo();
        ticketsDao = new Tickets();
        break;

    case "memory":
        const {CartManager} = await import("./managers/memory/CartManager.js");
        const {ProductManager} = await import("./managers/memory/ProductManager.js");
        cartsDAO = new CartManager();
        productDAO = new ProductManager();
        break;

};

export {cartsDAO, chatDAO, productDAO, usersDAO, ticketsDao};