import {Router} from "express"

import { 
    login, 
    logout, 
    register, 
    userProfile, 
    updateDetails, 
    checkRequestDetails 
} from "../controllers/user.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(register)

router.route("/login").post(login)

router.route("/logout").post(
    verifyJWT,    
    logout
)

router.route("/profile").get(
    verifyJWT,
    userProfile
)

router.route("/updateDetails").patch(
    verifyJWT,
    updateDetails
)

router.route("/request/checkDetails").post(
    verifyJWT,
    checkRequestDetails
)

export default router