import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({
    first_name:{type:String,required:true},
    last_name:{type:String,required:false},
    age:{type:Number,required:false},
    email:{type:String,required:true, unique:true},
    password:{type:String, required:true},
    cart:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"carts"
    },
    rol:{type: String, required:true, enum:["user","admin","premium"], default: "user"},
    documents:{
        type:[
            {
                name: {type:String, required:true},
                reference: {type:String, required:true}
            }

        ],
        default:[]
    },
    last_connection:{ type:Date, default: null},
    status:{type:String, required: true, enum:["Incompleto", "Completo", "Pendiente"], default:"Pendiente"},
    avatar:{type:String, default:""}
});

export const userModel = mongoose.model(usersCollection,usersSchema);