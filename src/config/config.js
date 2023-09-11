import dotenv from "dotenv"
dotenv.config();

export const configuracion = {
    filesystem:{
        products: "products.json",
        carts: "carts.json"
    },
    server:{
        port: process.env.PORT || 3000,
        secretSession: process.env.SECRET_SESION,
        persistence: process.env.PERSISTENCE,
        appEnv: process.env.NODE_ENV || "development",
        secretToken: process.env.SECRET_TOKEN
    },
    mongo:{
        url:process.env.MONGO_URL,
    },
    gmail:{
        adminEmail: process.env.ADMIN_EMAIL,
        adminPass: process.env.ADMIN_PASS
    }
};
