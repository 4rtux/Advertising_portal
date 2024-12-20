import { Request, Response, NextFunction, Router } from "express";
import { createToken, daysDifference, getNextDate, getTimestamps, uploadFile} from "../utils/helpers";

// import moment  from "moment";
import moment from "moment-timezone";
import UserService from "../services/services.user";
import ListingService from "../services/services.listing";
import { unlink } from "fs";
import ListingFavoriteService from "../services/services.listing_favorite";
import ReviewService from "../services/services.review";
import ReportService from "../services/services.report";
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
        const listingFavoriteService = new ListingFavoriteService()
        const favoriteListings = await listingFavoriteService.listingFavoritesDetail({user_id:id})
        const listings:any = []
        for (let i = 0; i < favoriteListings.length; i++) {
            const listingService = new ListingService()
            const listing = await listingService.listingDetails({id:favoriteListings[i].listing_id})
            listing.pictures.map((picture:any,index)=>{
                listing.pictures[index] = `http://localhost:4000/uploads/listings/${picture}`
            })
            listings.push(listing)
        }
        res.json({status:true,data:listings})
    }
    catch(err:any){
        console.log(err)
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

export const addFavorite = async (req: Request,res: Response)=>{
    const { listingID } = req.params
    const { id } = res.locals.user
    try{
        const listingFavoriteService = new ListingFavoriteService()
        // Check if listing is already a favorite
        try{
            const checkFavorite = await listingFavoriteService.listingFavoriteDetails({listing_id:Number(listingID),user_id:id})
            if(checkFavorite){
                res.json({status:false,data:{message:"Listing is already a favorite"}})
                return
            }
        }
        catch(err){
            const addedFavorite = await listingFavoriteService.createListingFavorite({listing_id:Number(listingID),user_id:id})
            res.json({...addedFavorite})
        }
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}


export const reportUser = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{
        console.log(req.body)
        const reportService  = new ReportService()
        const report = await reportService.createReport({description:req.body.report,made_by:id, culprit_id:req.body.userID, type:"user",resolved_by:0,status:1})
        res.json(report)
    }
    catch(err:any){
        console.log(err)
        res.status(401).json({status:false,message:err.message})
    }  
}
export const reviewUser = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{
        const reviewService  = new ReviewService()
        const review = await reviewService.createReview({...req.body,reviewed_by:id, user_id:req.body.userID})
        res.json(review)
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const userListings = async (req: Request,res: Response)=>{
    const { userID } = req.params
    try{
        const listingService = new ListingService()
        const userListing = await listingService.listingsDetail({user_id:Number(userID)})
        res.json({status:true,data:userListing})
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const createListing = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    try{
        if (req["files"] && Array.isArray(req["files"]["photos"])){
            const pictures:string[] = []
            req["files"]["photos"].forEach((file: any,index) => {
                const thumbnail = `listing-${id}${index}${moment().unix()}`;
                try{
                    const uploadedPhoto = uploadFile(thumbnail,"listings/",file);
                    if (uploadedPhoto.status) {
                        pictures.push(uploadedPhoto.filename);
                    }
                }
                catch(err:any){
                    console.log(err)
                }            
            });
            const listingService = new ListingService()
            const createListing = await listingService.createListing({...req.body,pictures,user_id:id})
            res.json(createListing)
        }
        else {
            console.log("No photos found in req.files.photos or it's not an array.");
        }
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

export const listingDetails = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    const { listingID } = req.params
    try{
        const listingService = new ListingService()
        const listing = await listingService.listingDetails({id:Number(listingID), user_id:Number(id)})
        listing.pictures.map((picture:any,index)=>{
            listing.pictures[index] = `http://localhost:4000/uploads/listings/${picture}`
            
        })
        res.json({status:true,data:listing})
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const deleteListing = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    const { listingID } = req.params
    try{
        const listingService = new ListingService()

        const listing = await listingService.listingDetails({id:Number(listingID), user_id:Number(id)})
            
        const deletedListing = await listingService.deleteListing ({id:Number(listingID), user_id:Number(id)})
        if (deletedListing) {
            listing.pictures.map((picture:any,index)=>{
                unlink(`uploads/listings/${picture}`,(err)=>{
                    if(err){
                        console.log(err)
                    }
                    // else{
                    //     console.log(`uploads/listings/${picture} deleted`)
                    // }
                })
            })
        }
        res.json({status:true,data:deletedListing.data})
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