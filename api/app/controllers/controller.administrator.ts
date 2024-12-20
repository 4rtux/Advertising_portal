import { Request, Response, NextFunction, Router } from "express";
import moment from "moment-timezone";
import { createToken, daysDifference, getNextDate } from "../utils/helpers";
import AdministratorService from "../services/services.administrator";
import UserService from '../services/services.user';
import CategoryService from '../services/services.category';

const timezone = 'Europe/Oslo';
export const login = async (req: Request,res: Response)=>{
    const { user, password} = req.body
    const administratorService = new AdministratorService()
    try{
        const details = await administratorService.administratorLogin(user,password)
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
    const administratorService = new AdministratorService()
    try{
        const createAdministrator = await administratorService.createAdministrator(req.body)
        res.json(createAdministrator)
    }
    catch(err:any){
        res.status(401).json({status:false,data:{message:err.message}})
    }
}



export const resetPassword = async (req: Request,res: Response)=>{
    try{
        const administratorService = new AdministratorService()
        const reset = await administratorService.resetPassword(req.body.user)
        res.json(reset)
    }
    catch(err:any){
        res.status(401).json({status:false,data:{message:err.message}})
    }
}

export const authentication = async (req: Request,res: Response)=>{
    const administrator = res.locals.administrator
    delete administrator.password
    res.send({status:true,data:administrator}) 
}


export const dashboardDetails = async (req: Request,res: Response)=>{
    try{
        // Get users
        const userService = new UserService()
        const users = await userService.userList()
        // Get categories
        const categoryService = new CategoryService()
        const categories = await categoryService.categoryList()
        res.json({status:true,data:{users,categories}})
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }
    
}

export const createCategory = async (req: Request,res: Response)=>{
    const { id } = res.locals.administrator
    try{
        const categoryService = new CategoryService()
        const newCategory = await categoryService.createCategory({added_by:id,approved_by:id,...req.body})
        res.json(newCategory)
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}


export const updateProfile = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{
        const administratorService = new AdministratorService()
        const updateReponse = await administratorService.updateProfile(id,req.body)
        res.json(updateReponse)
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const changePassword = async (req: Request,res: Response)=>{
    const { id } = res.locals.administrator
    try{
        const administratorService = new AdministratorService()
        const response = await administratorService.changePassword({id,...req.body})
        res.json(response)
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }
}

