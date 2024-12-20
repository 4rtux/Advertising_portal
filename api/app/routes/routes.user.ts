import { Router } from "express";
import { authUser } from "../middlewares/appMiddleware"
import {authentication, login, register, updateProfile, resetPassword, changePassword, userProfile} from  "../controllers/controller.user"
import * as user from  "../controllers/controller.user"

module.exports = app =>{
    
    const router = Router();

    router.post("/login",login);

    router.post("/register",register);
    router.post("/forget-password",resetPassword)

    router.get("/listings/:userID",user.userListings);

    // http://localhost:4001/v1/user/authentication

    router.use(authUser)
    router.get("/authentication",authentication);
    router.get("/verify-token",authentication);
    router.get("/recent-viewed",user.recentlyViewedListing);
    router.get("/user-favorites", user.favoritesListing);
    router.get("/user-viewed-history", user.viewedHistory);
    router.get("/listing-performance/:listingID", user.listingPerformance);
    router.post("/create-listing", user.createListing);
    router.post("/edit-listing", user.editListing);
    router.post("/edit-promotion", user.editPromotion);//pause, stop
    router.post("/promote-listing", user.promoteListing);
    router.delete("/delete-listing/:listingID",user.deleteListing);
    router.get("/listing/:listingID",user.listingDetails); 
    router.get("/add-favorite/:listingID",user.addFavorite); 
    router.post("/report", user.reportUser);
    router.post("/review", user.reviewUser);
    
    router.post("/profile",userProfile);
    router.post("/update-profile",updateProfile);
    router.post("/change-password",changePassword);
    
    app.use("/v1/user/",router);
}