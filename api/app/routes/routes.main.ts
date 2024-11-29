import { Router } from "express";
import {listings} from  "../controllers/controller.main"

module.exports = app =>{
    
    const router = Router();

    router.get("/listings",listings);
    // router.get("/listings/:userID",userListings);
    
    app.use("/v1/main/",router);
}