import mongoose,{Schema,model} from "mongoose"
import dotenv from "dotenv"

dotenv.config();



mongoose.connect(process.env.MONGO_URL as string)
.then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

const userSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        
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
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }
})
export const contentModel=model("Content",contentSchema);

const linkSchema=new Schema({
    hash:{
        type:String,  
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    }
})
export const LinkModel=model("Link",linkSchema);