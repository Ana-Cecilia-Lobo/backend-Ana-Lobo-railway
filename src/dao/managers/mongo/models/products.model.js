import mongoose, { Mongoose } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({

    title:{ type: String, required:true},
    description:{ type: String, required:true},
    price:{ type: Number, required:true},
    code:{ 
        type: String, 
        required: true, 
        unique: true,
    },
    status:{ type: Boolean, required:true, default: true},
    thumbnail:{ type: String},
    stock:{ type: Number, required:true},
    category:{ type: String, required:true},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref:"users", default: "64fdfdc175468492b8475b65"}
});

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollection,productsSchema);

//CODE UNICO!!!!!!!!