import e, { Request, Response, NextFunction, Router } from "express";
import { createToken, daysDifference, getNextDate, getTimestamps, uploadFile} from "../utils/helpers";

// import moment  from "moment";
import moment from "moment-timezone";
import UserService from "../services/services.user";
import ListingService from "../services/services.listing";
import { unlink } from "fs";
import ListingFavoriteService from "../services/services.listing_favorite";
import ReviewService from "../services/services.review";
import ReportService from "../services/services.report";
import PromotionService from "../services/services.promotion";
import ListingViewService from "../services/services.listing_view";
import CategoryService from "../services/services.category";
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
        console.log(req.body)
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
    const { id, status } = res.locals.user
    if(status !== 1){
        res.status(401).json({status:false,message:"Your account is not allowed to create listings"})
        return
    }
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

        // Count views
        const listingView = new ListingViewService()
        const views = await listingView.listingViewsDetail({listing_id:listing.id})
        // Favorite count
        const listingFavoriteService =  new ListingFavoriteService()
        const favorites = await listingFavoriteService.listingFavoritesDetail({listing_id:listing.id})

        // Get reviews
        const reviewService = new ReviewService()
        const reviews = await reviewService.reviewsDetail({user_id:listing.user_id})
        const myReviews:any = []
        // Get the name of the reviewers
        let totalRating = 0
        for(let i = 0; i < reviews.length; i++){
            const userService = new UserService()
            const user = await userService.userDetails({id:reviews[i].user_id})
            myReviews.push({...reviews[i],fullname:user.first_name+" "+user.last_name})
            totalRating += reviews[i].star
        }
        
        const categoryService = new CategoryService()
        const category = await categoryService.categoryDetails({id:listing.category_id})

        let promo = {promotionLabel:"Not Promoted",expire:"",start:"",plan_id:0}
        const promotion = new PromotionService()
        const promotionDetails = await promotion.promotionDetails({listing_id:listing.id})
        if(promotionDetails instanceof Object){
            const today = moment().unix();
            promo.expire = moment.unix(promotionDetails.to).format('ddd, DD MMM YYYY @ HH:mm')
            promo.start = moment.unix(promotionDetails.from).format('ddd, DD MMM YYYY @ HH:mm')
            promo.plan_id = promotionDetails.plan_id
            if(today > promotionDetails.to){
                promo.promotionLabel = "Promotion Expired"
            }
            else{
                promo.promotionLabel = "Promoted"
            }
        }

        res.json({status:true,data:{...listing, category:category.name, views:views.length, favorites:favorites.length, reviews:myReviews, promo}})
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
        console.log(req.body)
        const { plan_id, listing_id,user_id, days } = req.body
        const today = moment();
        const from = today.unix();
        const finishDate = today.add(days, 'days');
        const to = finishDate.unix();
        const promotionService = new PromotionService()
        const promotionResponse = await promotionService.createPromotion({listing_id,user_id,plan_id,from,to,paid:true, status:1})
        res.json(promotionResponse)
    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}


export const soldListing = async (req: Request,res: Response)=>{
    const { id } = res.locals.user
    const { listingID } = req.params
    try{
        const listingService = new ListingService()
        const listing = await listingService.listingDetails({id:Number(listingID), user_id:Number(id)})
        const updateListing = await listingService.updateListing(Number(listingID),{status:0})
        res.json(updateListing)
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