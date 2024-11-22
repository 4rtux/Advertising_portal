import { verifyDayToken, genDayToken, JWT_SECRET } from './../utils/helpers'; 
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// import { Op } from "sequelize";
import dotenv from 'dotenv'
import { createToken,formatUnix } from "../utils/helpers";
import AdministratorService from "../services/services.administrator";
import UserService from "../services/services.user";

dotenv.config();





export const authAdministrator = (req: Request,res: Response, next: NextFunction) =>{
    let auth = req.headers['x-authorization'];
    auth = auth?.toString()

    // Verify and extract the JWT token
    const jwtToken = auth ? auth.split(' ')[1] : null;
    
    if(!jwtToken){
        return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
    }
    else{       
        jwt.verify(jwtToken,process.env.JWT_SECRET,async(err,decodedToken)=>{
            if(err){
                console.log({err});
                return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
            }
            else{
                const { userID, role } = decodedToken.auth;
                if(role !== "administrator"){
                    return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
                }
                try{
                    const administratorService = new AdministratorService()
                    const administrator = await administratorService.administratorDetails({id: userID})
                    res.locals.administrator = administrator
                    next()
                }
                catch(err:any){
                    console.log({err})
                    return res.status(401).json({status:false,data:{message:"You are not authorized to make this request, or visit this page"}})
                }
            }
        })
    }
    
}

const validateDayToken = (dayToken:string) =>{
    try{
        const decoded = jwt.verify(dayToken,process.env.JWT_SECRET)
        const verifiedDayToken:any = verifyDayToken(decoded.dayToken)
        if(verifiedDayToken.isNew){
            verifiedDayToken.token = createToken("dayToken",{id:verifiedDayToken.id,timestamp:verifiedDayToken.timestamp})
        }
        return verifiedDayToken
    }
    catch(err){
        console.log({err})
        const newDayToken:any = verifyDayToken(null)
        newDayToken.token = createToken("dayToken",{id:newDayToken.id,timestamp:newDayToken.timestamp})
        return newDayToken
    }
}

export const authUser = (req: Request,res: Response, next: NextFunction) =>{
    let auth = req.headers['x-authorization'];
    auth = auth?.toString()
    let dayToken = req.headers['day-token'];
    dayToken = dayToken?.toString();
    if(dayToken){
        dayToken = validateDayToken(dayToken);
        // console.log("validateDayToken", dayToken)
    }
    else{
        // Generate a new day token
        const newDayToken:any = verifyDayToken(null)
        newDayToken.token = createToken("dayToken",{id:newDayToken.id,timestamp:newDayToken.timestamp})
        dayToken = newDayToken
        // console.log("newDayToken", dayToken)
    }

    // Verify and extract the JWT token
    const jwtToken = auth ? auth.split(' ')[1] : null;
    
    if(!jwtToken){
        return res.status(401).json({status:false,data:{message:"1. You are not authorized to make this request, or visit this page"}})
    }
    else{       
        jwt.verify(jwtToken,JWT_SECRET,async(err,decodedToken)=>{
            if(err){
                console.log({err});
                console.log({jwtToken,JWT_SECRET})
                return res.status(401).json({status:false,data:{message:"2. You are not authorized to make this request, or visit this page"}})
            }
            else{
                const { userID, role } = decodedToken.auth;
                if(role !== "user"){
                    return res.status(401).json({status:false,data:{message:"3. You are not authorized to make this request, or visit this page"}})
                }
                try{
                    const userService = new UserService()
                    const user:any = await userService.userDetails({id: userID})
                    user.dayToken = dayToken
                    res.locals.user = user
                    next() 
                }
                catch(err: any){
                    console.log({err})
                    return res.status(401).json({status:false,data:{message:"4. You are not authorized to make this request, or visit this page"}})
                }
            }
        })
    }    
}


module.exports.settings = async (req,res, next) =>{
    next()
}


module.exports.helpers = async (req,res,next)=>{
    res.locals.formatUnix = formatUnix
    next()
}

