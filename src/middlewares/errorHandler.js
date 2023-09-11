import { EError } from "../enums/EError.js";

 const errorHandler = (error,req,res,next)=>{

    switch (error.code) {
        case EError.ROUTING_ERROR:
            res.json({status:"error", message:error.message});
            break;
        case EError.DATABASE_ERROR:
            res.json({status:"error", message:error.message});
            break;
        case EError.AUTH_ERROR:
            res.json({status:"error", message:error.message});
            break;
        case EError.INVALID_JSON:
            res.json({status:"error",message:error.cause});
            break;
        case EError.INVALID_PARAMS:
            res.json({status:"error", message: "a"});
            break;
        default:
            break;
    }
}