import { Router } from "express";
import { authUser } from "../middlewares/appMiddleware"
import {authentication, login, register, updateProfile, resetPassword, changePassword} from  "../controllers/controller.user"

module.exports = app =>{
    
    const router = Router();

    router.post("/login",login);

    router.post("/register",register);
    router.post("/forget-password",resetPassword)

    // http://localhost:4001/v1/user/authentication

    router.use(authUser)
    router.get("/authentication",authentication);
    
    router.post("/update-profile",updateProfile);
    router.post("/change-password",changePassword);
    
    app.use("/v1/user/",router);
}