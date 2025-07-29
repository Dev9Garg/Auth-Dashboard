import {Router} from "express"
import { adminProfile, allUsers, removeUser, updateUserDetails } from "../controllers/user.controller.js"
import { addEmail, removeEmail, allBlacklistedEmails, allEmails } from "../controllers/blacklistEmail.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/profile").get(
    verifyJWT,
    adminProfile
)

router.route("/allUsers").get(
    verifyJWT,
    allUsers
)

router.route("/allEmails").get(
    verifyJWT,
    allEmails
)

router.route("/allBlacklistedEmails").get(
    verifyJWT,
    allBlacklistedEmails
)

router.route("/addEmail").post(
    verifyJWT,
    addEmail
)

router.route("/removeEmail").post(
    verifyJWT,
    removeEmail
)

router.route("/removeUser").post(
    verifyJWT,
    removeUser
)

router.route("/updateUserDetails").patch(
    verifyJWT,
    updateUserDetails
)



export default router