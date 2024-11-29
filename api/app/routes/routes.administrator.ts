import { Router } from "express";
// import useragent from "express-useragent";

import { authAdministrator } from "../middlewares/appMiddleware"
import { authentication, changePassword, login, register, resetPassword, updateProfile } from "../controllers/controller.administrator";
module.exports = app =>{

    const router = Router();
    router.post("/login",login);

    router.post("/register",register);
    router.post("/reset-password",resetPassword);
    // http://localhost:4001/v1/administrator/authentication

    router.use(authAdministrator)
    router.get("/authentication",authentication);
    router.post("/update-profile",updateProfile);
    router.post("/change-password",changePassword);
    
    
    
    app.use("/v1/administrator/",router);
}