import { Request, Response, NextFunction, Router } from "express";
import { decodeLink, encodeLink } from "../utils/helpers";
import ListingService from "../services/services.listing";
import UserService from "../services/services.user";
import ListingViewService from "../services/services.listing_view";
import ListingFavoriteService from "../services/services.listing_favorite";
import ReviewService from "../services/services.review";
import PromotionService from "../services/services.promotion";
import moment from "moment-timezone";

export const listings = async (req: Request,res: Response)=>{
    const listingService = new  ListingService()
    try{
        // const allListings = await listingService.listingList()
        const allListings = await listingService.listingsDetail({status:1})
        allListings.map((listing:any)=>{
            listing.pictures.map((picture:any,index:number)=>{
                listing.pictures[index] = `http://localhost:4000/uploads/listings/${picture}`
            })
        })
        res.json({status:true,data:{listings:allListings}})
    }
    catch(err:any){
        console.log({err})
        res.status(401).json({status:false,data:{message:"Error fetching listings"}})
    }
}

export const listingDetails = async (req: Request,res: Response)=>{
    try{
        const { listingID } = req.params
        let userID = 0
        if(res.locals.user){
            userID = res.locals.user.id
        }
        const listingService = new ListingService()
        const listing = await listingService.listingDetails({id:Number(listingID)})
        listing.pictures.map((picture:any,index)=>{
            listing.pictures[index] = `http://localhost:4000/uploads/listings/${picture}`
        })

        // Record view
        const listingView = new ListingViewService()
        const view = await listingView.createListingView({listing_id:listing.id,user_id:userID})


        // Get 5 with same category_id
        let relatedListings = await listingService.listingsDetail({category_id:listing.category_id, status:1})
        relatedListings.map((listing:any)=>{
            listing.pictures.map((picture:any,index:number)=>{
                listing.pictures[index] = `http://localhost:4000/uploads/listings/${picture}`
            })
        })
        // get first 5 related listings
        relatedListings = relatedListings.slice(0,5)
        // Get 5 with same user_id
        let userListing = await listingService.listingsDetail({user_id:listing.user_id, status:1})
        userListing.map((listing:any)=>{
            listing.pictures.map((picture:any,index:number)=>{
                listing.pictures[index] = `http://localhost:4000/uploads/listings/${picture}`
            })
        })
        // get first 5 user listings
        userListing = userListing.slice(0,5)
        // Count views
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
        totalRating = totalRating/reviews.length
        
        // Get user details
        const userService = new UserService()
        const user = await userService.userDetails({id:listing.user_id})
        // if(user.picture){
        //     user.picture = `http://localhost:4000/uploads/users/${user.picture}`
        // }
        user.password = ''

        res.json({status:true,data:{listing,relatedListings,sellerListings:userListing,seller:{user,reviews:myReviews, ratings: totalRating}, views:views.length, favorites:favorites.length}})
    }
    catch(err:any){
        console.log({err})
        res.status(401).json({status:false,message:err.message})
    }  
}

export const searchListings = async (req: Request, res: Response) => {
    const { keyword } = req.params;
    const listingService = new ListingService();
    const promotionService = new PromotionService();
    const returnListings: any[] = [];

    try {
        // Fetch search results
        const searchResults = await listingService.listingsSearch(keyword, '', '');

        // Process search results with async operations
        for (const listing of searchResults) {
            // Update picture URLs
            listing.pictures = listing.pictures.map(
                (picture: string) => `http://localhost:4000/uploads/listings/${picture}`
            );

            // Check if listing is promoted
            let promotionID = 0;
            try {
                const promoted = await promotionService.promotionDetails({ listing_id: listing.id });

                if (promoted instanceof Object) {
                    const today = moment().unix();
                    promotionID = today > promoted.to ? 0.5 : promoted.id;
                }
            } catch (error) {
                console.error(`Failed to fetch promotion details for listing ID: ${listing.id}`, error);
            }

            // Add to return listings with promotion details
            returnListings.push({ ...listing["dataValues"], promotionID });
        }

        // Sort listings by promotion ID desc
        returnListings.sort((a, b) => b.promotionID - a.promotionID);

        // Respond with processed listings
        return res.json({ status: true, data: returnListings });
    } catch (error) {
        console.error('Error processing listings:', error);

        // Send error response only if no response has been sent yet
        if (!res.headersSent) {
            return res.status(500).json({ status: false, message: 'An error occurred' });
        }
    }
};



export const promotedListings = async (req: Request,res: Response)=>{
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}

export const userListings = async (req: Request,res: Response)=>{
    try{

    }
    catch(err:any){
        res.status(401).json({status:false,message:err.message})
    }  
}