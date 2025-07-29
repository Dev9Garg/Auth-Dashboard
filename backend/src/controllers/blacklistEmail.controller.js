import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BlacklistEmails } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST request for adding the email 
const addEmail = asyncHandler( async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        throw new ApiError(
            401,
            "You are not admin, so you can't blacklist the emails !!"
        )
    }

    const {email} = req.body;

    console.log(email);

    if(email?.trim() === "") {
        throw new ApiError(
            400,
            "Please provide some email before adding it !!"
        )
    }

    const existingEmail = await BlacklistEmails.findAll({
        where: {
            email: email
        }
    })

    if(existingEmail.length !== 0) {
        throw new ApiError(
            400,
            "Email already exists !!"
        )
    }

    if(email === user.email) {
        throw new ApiError(
            400,
            "You can't blacklist your own email !!"
        )
    }

    const createdEmail = await BlacklistEmails.create({
        email: email
    })

    if(!createdEmail) {
        throw new ApiError(
            500,
            "Something went wrong while adding the email !!"
        )
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            200, 
            createdEmail,
            "Email blacklisted successfully !!"
        )
    )
})

// DELETE request for deleting the email
const removeEmail = asyncHandler( async (req, res) => {
    const user = req.user

    if(!user.isAdmin) {
        throw new ApiError(
            401,
            "You are not admin, so you can't delete the blacklisted emails !!"
        )
    }

    const {emailId} = req.body

    if(emailId.trim() === "") {
        throw new ApiError(
            400,
            "Please provide id of the email which is to be deleted !!"
        )
    }

    const notExistingId = await BlacklistEmails.findAll({
        where: {
            id: emailId
        }
    })

    if(notExistingId.length === 0) {
        throw new ApiError(
            400,
            "Such email id does not exist, so it can't be deleted"
        )
    }

    const deletedId = await BlacklistEmails.destroy({
        where: {
            id: emailId
        }
    })

    if(!deletedId) {
        throw new ApiError(
            500,
            "Something went wrong while deleting the requested Id !!"
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Email id was successfully deleted from the database !!"
        )
    )
})

// GET request for fetching all the blacklisted emails in the database
const allBlacklistedEmails = asyncHandler( async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        throw new ApiError(
            401,
            "You are not admin, so you can't see the blacklisted emails !!"
        )
    }

    const blacklistedEmails = await BlacklistEmails.findAll()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            blacklistedEmails,
            "successfully fetched all the blacklisted emails !!"
        )
    )
})

export {
    addEmail,
    removeEmail,
    allBlacklistedEmails
}