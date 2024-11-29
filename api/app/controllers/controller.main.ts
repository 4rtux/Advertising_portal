import { Request, Response, NextFunction, Router } from "express";
import { decodeLink, encodeLink } from "../utils/helpers";
import ListingService from "../services/services.listing";

export const listings = async (req: Request,res: Response)=>{
    const listingService = new  ListingService()
    try{
        const allListings = await listingService.listingList()
        res.json({status:true,data:{listings:allListings}})
    }
    catch(err:any){
        console.log({err})
        res.status(401).json({status:false,data:{message:"Error fetching listings"}})
    }
}