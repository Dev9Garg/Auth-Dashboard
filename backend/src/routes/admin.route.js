import {Router} from "express"

import { 
    adminProfile, 
    allRequests, 
    allUsers, 
    approveRequest, 
    makeAdmin, 
    rejectRequest, 
    removeAdmin, 
    removeUser, 
    statusActive, 
    statusInactive, 
    updateUserDetails 
} from "../controllers/user.controller.js"

import { 
    addEmail, 
    removeEmail, 
    allEmails 
} from "../controllers/blacklistEmail.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";


// router
const router = Router();


// routes
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

router.route("/makeAdmin").post(
    verifyJWT,
    makeAdmin
)

router.route("/removeAdmin").post(
    verifyJWT,
    removeAdmin
)

router.route("/statusInactive").post(
    verifyJWT,
    statusInactive
)

router.route("/statusActive").post(
    verifyJWT,
    statusActive
)

router.route("/allRequests").get(
    verifyJWT,
    allRequests
)
 
router.route("/approveRequest").post(
    verifyJWT,
    approveRequest
)

router.route("/rejectRequest").post(
    verifyJWT,
    rejectRequest
)



export default router