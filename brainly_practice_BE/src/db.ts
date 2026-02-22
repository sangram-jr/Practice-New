import mongoose,{Schema,model} from "mongoose"
import dotenv from "dotenv"
import { ref, title } from "node:process";
import { types } from "node:util";
dotenv.config();


mongoose.connect(process.env.MONGO_URL as string);

const userSchema=new Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
        unique:true
    }
});
export const userModel=model("User", userSchema);

const contentSchema=new Schema({
    title:{
        type:String
    },
    link:{
        type:String
    },
    types:{
        type:String
    },
    userId:{
        type:new mongoose.Types.ObjectId,
        ref:"User",
        require:true
    }
})
export const contentModel=model("Content",contentSchema);

const linkSchema=new Schema({
    hash:{
        type:String,  
    },
    userId:{
        type:new mongoose.Types.ObjectId,
        ref:"User",
        require:true,
        unique:true
    }
})
export const LinkModel=model("Link",linkSchema);