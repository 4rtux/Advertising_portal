import { Request, Response, NextFunction, Router } from "express";
import moment from "moment-timezone";
import { createToken, daysDifference, getNextDate } from "../utils/helpers";
import AdministratorService from "../services/services.administrator";
import UserService from '../services/services.user';
import CategoryService from '../services/services.category';
import ListingService from "../services/services.listing";
import ListingViewService from "../services/services.listing_view";
import ListingFavoriteService from "../services/services.listing_favorite";
import ReviewService from "../services/services.review";

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


export const userProfile = async (req: Request,res: Response)=>{
    try{
        const { userID } = req.params
        const listingService = new ListingService()
        // Get 5 with same user_id
        const userListings = await listingService.listingsDetail({user_id:Number(userID), status:1})
        userListings.map((listing:any)=>{
            listing.pictures.map((picture:any,index:number)=>{
                listing.pictures[index] = `http://localhost:4000/uploads/listings/${picture}`
            })
        })
        // Get reviews
        const reviewService = new ReviewService()
        const reviews = await reviewService.reviewsDetail({user_id:Number(userID)})
        // console.log({reviews})
        const myReviews:any = []
        // Get the name of the reviewers
        let totalRating = 0
        for(let i = 0; i < reviews.length; i++){
            const userService = new UserService()
            const user = await userService.userDetails({id:reviews[i].user_id})
            myReviews.push({...reviews[i],fullname:user.first_name+" "+user.last_name})
            totalRating += reviews[i].star
        }
        totalRating = totalRating/reviews.length
        
        // Get user details
        const userService = new UserService()
        const user = await userService.userDetails({id:Number(userID)})
        // if(user.picture){
        //     user.picture = `http://localhost:4000/uploads/users/${user.picture}`
        // }
        user.password = ''

        res.json({status:true,data:{sellerListings:userListings,user,reviews:myReviews, ratings: totalRating}})
    }
    catch(err:any){
        console.log({err})
        res.status(401).json({status:false,message:err.message})
    }  
}


export const restrictUser = async (req: Request,res: Response)=>{
    try{
        const userService = new UserService()
        const restrictResponse = await userService.updateUser(Number(req.body.userID),{status:req.body.status})
        res.json(restrictResponse)
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

