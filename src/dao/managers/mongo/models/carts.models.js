import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
    products: {
        type:[
            {
                productId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"products"
                },
                quantity:{
                    type:Number,
                    required:true,
                    default:1
                }
            }
        ],
        required:true,
        default:[]
    }
});

cartsSchema.plugin(mongoosePaginate);

export const cartsModel = mongoose.model(cartsCollection,cartsSchema);