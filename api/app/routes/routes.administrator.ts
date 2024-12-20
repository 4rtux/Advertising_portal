import { Router } from "express";
// import useragent from "express-useragent";

import { authAdministrator } from "../middlewares/appMiddleware"
import * as admin from "../controllers/controller.administrator";
module.exports = app =>{
    const router = Router();
    router.post("/login",admin.login);

    router.post("/register",admin.register);
    router.post("/reset-password",admin.resetPassword);
    // http://localhost:4001/v1/administrator/authentication

    router.use(authAdministrator)
    router.get("/verify-token",admin.authentication);
    router.get("/dashboard",admin.dashboardDetails);
    router.post("/update-profile",admin.updateProfile);
    router.post("/change-password",admin.changePassword);
    router.get("/user/:userID",admin.changePassword);
    router.post("/restrict-user/:userID",admin.updateProfile);
    router.post("/create-category",admin.createCategory);
    router.post("/edit-category/:id",admin.updateProfile);
    
    
    
    app.use("/v1/administrator/",router);
}