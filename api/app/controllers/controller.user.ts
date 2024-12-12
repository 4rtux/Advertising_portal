import { Request, Response, NextFunction, Router } from "express";
import { createToken, daysDifference, getNextDate, getTimestamps} from "../utils/helpers";

// import moment  from "moment";
import moment from "moment-timezone";
import UserService from "../services/services.user";
const timezone = 'Europe/Warsaw';

export const login = async (req: Request,res: Response)=>{
    const { user, password} = req.body
    const userService = new UserService()
    try{
        const details = await userService.userLogin(user,password)
        res.json(details)
    }
    catch(err:any){
        console.log({err})
        res.status(401).json({status:false,data:{message:err.message}})
    }
}

export const register = async (req: Request,res: Response)=>{
    if(req.body.password !== req.body.confirm_password){
        res.status(401).json({status:false,data:{message:"Passwords do not match"}})
        return
    }
    const userService = new UserService()
    try{
        const createUser = await userService.createUser(req.body)
        res.json(createUser)
    }
    catch(err:any){
        res.status(401).json({status:false,data:{message:err.message}})
    }
}


export const resetPassword = async (req: Request,res: Response)=>{
    try{
        const userService = new UserService()
        const reset = await userService.resetPassword(req.body.user)
        res.json(reset)
    }
    catch(err:any){
        res.status(401).json({status:false,data:{message:err.message}})
    }
}


export const authentication = async (req: Request,res: Response)=>{
    const user = res.locals.user
    delete user.password
    delete user.dayToken.id
    user.displayPicture = "https://link.to/images/profile-head.jpg"
    res.send({status:true,data:user}) 
}


export const userProfile = async (req: Request,res: Response)=>{
    const user = res.locals.user
    res.json({status:true, user})
}


export const updateProfile = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{
        const userService = new UserService()
        const updateReponse = await userService.updateProfile(id,req.body)
        res.json(updateReponse)
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}


export const changePassword = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{
        const userService = new UserService()
        const response = await userService.changePassword({id,...req.body})
        res.json(response)
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }
}


export const recentlyViewedListing = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const favoritesListing = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const viewedHistory = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const userListings = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const createListing = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const editListing = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const deleteListing = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const promoteListing = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}
 
export const editPromotion = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const listingPerformance = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}