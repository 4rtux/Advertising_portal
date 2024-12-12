import { Router } from "express";
import * as main from  "../controllers/controller.main"

module.exports = app =>{
    
    const router = Router();

    router.get("/listings",main.listings);

    router.get("/promoted-listings", main.promotedListings);
    router.get("/search-listings/:keyword",main.searchListings); //search the table for category and  listing name, return the top promoted listing first, also listings in same town following it. If the not match for promoted product, show a random promoted project, and the promoted listing ID impression should be incremented

    router.get("/listing/:listingID",main.listingDetails); //also show more product from the seller and sma product with same category
    
    
    
    app.use("/v1/main/",router);
}