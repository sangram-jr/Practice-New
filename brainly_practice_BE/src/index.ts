import express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { userModel } from "./db.js";

const app=express();
app.use(express.json());

dotenv.config();
const JWT_PASSWORD=process.env.JWT_PASSWORD as string;
//testing
app.get('/',(req,res)=>{
    res.json({
        message:"hello world"
    })
});

//sing up 
app.post('/signup',async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    await userModel.create({
        username:username,
        password:password
    })
    res.status(200).json({message:"sign up successfull"})
})
app.listen(3000,()=>{
    console.log("server running on port 3000");
    
});

//signin
app.post('/signin',async(req,res)=>{

    try {
        const username=req.body.username;
        const password=req.body.password;
        const existingUser=await userModel.findOne({
            username:username,
            password:password
        })
        if(existingUser){
            const token=jwt.sign({
                id:existingUser._id
            },JWT_PASSWORD)
            res.json({token})
        }else{
            res.status(401).json({message:"user not found"})
        }
       

    } catch (error) {
        res.status(411).json({
            message: "sign in not successfull"
        })
    }
})