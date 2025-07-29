import {Router} from "express"
import { login, logout, register, userProfile, updateDetails } from "../controllers/user.controller.js"
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

export default router