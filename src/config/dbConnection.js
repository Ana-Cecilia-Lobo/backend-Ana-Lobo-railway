import mongoose from "mongoose";
import { configuracion } from "./config.js";
import { config } from "dotenv";
import { logger } from "../utils/logger.js";

export const connectDB = async()=>{
    try {
        await mongoose.connect(configuracion.mongo.url);
        logger.info("base de datos conectada");
    } catch (error) {
        logger.fatal(`Hubo un error al conectar la base de datos ${error.message}`);
    }
}