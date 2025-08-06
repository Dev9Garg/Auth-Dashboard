import { ApiResponse } from "../utils/ApiResponse.js";
import { BlacklistEmails, User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST request for adding the email 
const addEmail = asyncHandler( async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        return res
        .status(401)
        .json(
            { 
                success: false, 
                message: "You are not admin, so you can't blacklist the emails !!"
            }
        );
    }

    const {emailToBeBlacklisted} = req.body;

    if(emailToBeBlacklisted?.trim() === "" || emailToBeBlacklisted === undefined) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please provide some email before adding it !!"
            }
        );
    }

    const existingEmail = await BlacklistEmails.findAll({
        where: {
            email: emailToBeBlacklisted
        }
    })

    if(existingEmail.length !== 0) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Email already exists !!"
            }
        );
    }

    if(emailToBeBlacklisted === user.email) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You can't blacklist your own email !!"
            }
        );
    }

    const emailToBeBlacklistedIsAnAdmin = await User.findOne({
        where: {
            email: emailToBeBlacklisted
        }
    })

    if(emailToBeBlacklistedIsAnAdmin.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You cannot blacklist the email of an admin !!"
            }
        );
    }

    const createdEmail = await BlacklistEmails.create({
        email: emailToBeBlacklisted,
        blockedBy: user.fullName
    })

    if(!createdEmail) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while adding the email !!"
            }
        );
    }

    const existingUser = await User.findOne({
        where: {
            email: emailToBeBlacklisted
        }
    })

    if(existingUser) {
        await existingUser.update({
            isBlacklisted: true
        })
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

    if(user.id !== 1) {
        return res
        .status(401)
        .json(
            { 
                success: false, 
                message: "You are not sole admin, so you can't delete the blacklisted emails !!"
            }
        );
    }

    const {email, emailId} = req.body

    if(
        !emailId && (!email || email.trim() === "")
    ) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please fill atleast one field !!"
            }
        );
    }


    if(email === undefined) {
        const notExistingId = await BlacklistEmails.findOne({
            where: {
                id: emailId
            }
        })

        if(!notExistingId) {
            return res
            .status(400)
            .json(
                { 
                    success: false, 
                    message: "Such email id does not exist, so it can't be deleted"
                }
            );
        }

        const checkEmail = await User.findOne({
            where: {
                email: notExistingId.email
            }
        })

        if(checkEmail) {
            const updateUserBlacklistEmail = await checkEmail.update({
                isBlacklisted: false
            })

            if(!updateUserBlacklistEmail) {
                return res
                .status(500)
                .json(
                    { 
                        success: false, 
                        message: "Something went wrong while updating the isBlacklist column of the user to false !!"
                    }
                );
            }
        } else {
            console.log("this email is not signed in !!")
        }

        const deletedId = await BlacklistEmails.destroy({
            where: {
                id: emailId
            }
        })

        if(!deletedId) {
            return res
            .status(500)
            .json(
                { 
                    success: false, 
                    message: "Something went wrong while deleting the requested Id !!"
                }
            );
        }

    } else if(!emailId) {
        const notExistingEmail = await BlacklistEmails.findAll({
            where: {
                email: email
            }
        })

        if(notExistingEmail.length === 0) {
            return res
            .status(400)
            .json(
                { 
                    success: false, 
                    message: "Such email does not exist, so it can't be deleted"
                }
            );
        }

        const deletedEmail = await BlacklistEmails.destroy({
            where: {
                email: email
            }
        })

        if(!deletedEmail) {
            return res
            .status(500)
            .json(
                { 
                    success: false, 
                    message: "Something went wrong while deleting the requested email !!"
                }
            );
        }

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        })

        if(existingUser) {
            await existingUser.update({
                isBlacklisted: false
            })
        }
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
const allEmails = asyncHandler( async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        return res
        .status(401)
        .json(
            { 
                success: false, 
                message: "You are not admin, so pls do not try to access this route !!"
            }
        );
    }

    const allEmail = await BlacklistEmails.findAll();

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allEmail,
            "all emails fetched successfully !!"
        )
    )
})

export {
    addEmail,
    removeEmail,
    allEmails
}