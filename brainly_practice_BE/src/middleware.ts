import type { Request,Response,NextFunction } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_PASSWORD=process.env.JWT_PASSWORD as string;

// Extend Express Request to include userId ->So TypeScript understands: req.userId -> otherwise ts gives error
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const userMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    try{

        const authHeader=req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({message:"authHeader missing"})
        }
        //fetch token
        const token=authHeader.split(" ")[1]; // since we send-> bearer aldkhglambw384lNLGNs

        if(!token){
            return res.status(401).json({message:"token missing"})
        }
        const decoded=jwt.verify(token,JWT_PASSWORD) as JwtPayload;
        if(!decoded.id){
            return res.json({message:"decode is not happen"})
        }
        //attach userId to request
        req.userId=decoded.id as string;
        //move to the next route
        next();

    }catch(error){
        return res.status(401).json({message:"Invalid token"})
    }
}