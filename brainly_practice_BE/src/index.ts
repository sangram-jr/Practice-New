import express from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { contentModel, LinkModel, userModel } from "./db.js";
import { userMiddleware } from "./middleware.js";
import mongoose from "mongoose";
import { random } from "./utils.js";

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

//content creation
app.post('/content',userMiddleware,async(req,res)=>{
    try {
        const title=req.body.title;
        const link=req.body.link;
        const type=req.body.type;

        if(!req.userId){
            return res.status(401).json({message:"not authorized"});
        }

        if (!title || !link || !type) {
        return res.status(400).json({ message: "Missing fields" });
        }

        await contentModel.create({
            title:title,
            link:link,
            type:type,
            userId:new mongoose.Types.ObjectId(req.userId)
        })
        res.status(200).json({message:"content added"});

    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
    
});

//fetch the content
app.get('/content',userMiddleware,async(req,res)=>{
    try {
        if(!req.userId){
            return res.status(401).json({message:"unAuthorized"});
        }
       const content=await contentModel.find({
        userId:req.userId
       }).populate("userId", "username") ;

       res.status(200).json({content});

    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
})

//delete content
app.delete('/content',userMiddleware,async(req,res)=>{
    try {

        if(!req.userId){
            return res.status(401).json({message:"unAuthorized"});
        }

        const contentId=req.body.contentId;
        await contentModel.deleteOne({
            userId:req.userId,
            _id:contentId
        });
        res.status(200).json({message:"content delete successfully"});
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
})

//generate Link
app.post('/share',userMiddleware,async(req,res)=>{
    try {
        
        const share=req.body.share;
        if(!req.userId){
            return res.status(401).json({message:"unAuthorized"});
        }
        if(share===true){
            //find existing link
            const existingLink=await LinkModel.findOne({
                userId:req.userId
            })
            if(existingLink){
                res.status(200).json({hash:existingLink.hash})
            }
            //if existing link not present then create new link
            const newHash=random(10);
            const newLink=await LinkModel.create({
                hash:newHash,
                userId:req.userId
            })
            res.status(200).json({newLink});
            

        }else{
            await LinkModel.deleteOne({
                userId:req.userId
            })
            res.json({message:"link deleted"})
        }
    } catch (error) {
         return res.status(500).json({message:"Internal Server Error"});
    }
    
})

//share link(by this link anyone can access to the indivisual's content)
app.get('/share/:shareLink',async(req,res)=>{
    try {
        
        const hash=req.params.shareLink;
        

        //first find correct hash
        const existingHash=await LinkModel.findOne({
            hash:hash
        });
        if(!existingHash){
           return res.status(201).json({message:"hash not found"})
        };
        //2nd find content from linkModel's userId
        const content=await contentModel.find({
            userId:existingHash.userId
        })
        if(!content){
            return res.status(201).json({message:"content not found"});
        };
        //3rd find user from linkModel's userId
        const user=await userModel.findOne({
            _id:existingHash.userId
        })
        if(!user){
            return res.status(201).json({message:"user not found"});
        }
        //send content and username
        res.json({
            username:user.username,
            content:content
        });

    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"});
    }
    
})
app.listen(3000,()=>{
    console.log("server running on port 3000");
    
});