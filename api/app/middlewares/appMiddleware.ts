import { verifyDayToken, genDayToken, JWT_SECRET } from './../utils/helpers'; 
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// import { Op } from "sequelize";
import dotenv from 'dotenv'
import { createToken,formatUnix } from "../utils/helpers";
import AdministratorService from "../services/services.administrator";
import UserService from "../services/services.user";

dotenv.config();


const validateToken = (token:string) =>{
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        return decoded.auth
    }
    catch(err){
        console.log({err})
        return null
    }
}



export const authAdministrator = async (req: Request,res: Response, next: NextFunction) =>{
    const authHeader = req.headers['authorization']; // Get the 'Authorization' header
    if (!authHeader) return res.status(401).json({ message: 'Authorization header is missing' });

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Token is missing' });
    const validToken = validateToken(token);
    if(!validToken){
        return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    }
    else{   
        const { administratorID, role } = validToken;
        if(role !== "administrator"){
            return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
        }
        try{
            const administratorService = new AdministratorService()
            const administrator:any = await administratorService.administratorDetails({id: administratorID})
            res.locals.administrator = administrator
            next() 
        }
        catch(err: any){
            console.log({err})
            return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
        }
    }  
    
}


export const getUser = async (req: Request,res: Response, next: NextFunction) =>{
    const authHeader = req.headers['authorization']; // Get the 'Authorization' header
    if (!authHeader) return res.status(401).json({ message: 'Authorization header is missing' });

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Token is missing' });
    const validToken = validateToken(token);
    if(!validToken){
        res.locals.user = null
        next() 
    }
    else{   
        const { userID, role } = validToken;
        if(role !== "user"){
            res.locals.user = null
            next() 
        }
        try{
            const userService = new UserService()
            const user:any = await userService.userDetails({id: userID})
            res.locals.user = user
            next() 
        }
        catch(err: any){
            res.locals.user = null
            next() 
        }
    }    
}


export const authUser = async (req: Request,res: Response, next: NextFunction) =>{
    const authHeader = req.headers['authorization']; // Get the 'Authorization' header
    if (!authHeader) return res.status(401).json({ message: 'Authorization header is missing' });

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Token is missing' });
    const validToken = validateToken(token);
    if(!validToken){
        return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    }
    else{   
        const { userID, role } = validToken;
        if(role !== "user"){
            return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
        }
        try{
            const userService = new UserService()
            const user:any = await userService.userDetails({id: userID})
            res.locals.user = user
            next() 
        }
        catch(err: any){
            console.log({err})
            return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
        }
    }    
}


module.exports.settings = async (req,res, next) =>{
    next()
}


module.exports.helpers = async (req,res,next)=>{
    res.locals.formatUnix = formatUnix
    next()
}

