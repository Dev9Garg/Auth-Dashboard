import { ApiResponse } from "../utils/ApiResponse.js";
import { User, BlacklistEmails, Request } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Op } from '@sequelize/core';
import bcrypt from "bcrypt" 
import { 
    emailValidation, 
    passwordValidation, 
    usernameValidation 
} from "../schemas/signUpSchema.js";

// method for generating access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res
            .status(404)
            .json(
                { 
                    success: false, 
                    message: "User not found while generating tokens"
                }
            );
        }
        
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validate: false})

        return {accessToken, refreshToken}
    } catch (error) {
        console.error("Token generation error:", error);
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while generating access and refresh tokens"
            }
        );
    }
}

// POST request for adding the user in the database
const register = asyncHandler( async (req, res) => {
    // want paramter username, email and password
    // validation that if all are there or not 
    // if all present - check if the user already exists in the database or not 
    // if present show msg - user already exists
    // if does not present then store the user details in the database and show success msg 

    const {username, email, fullName, contactNumber, password} = req.body;
 
    if(
        [username, email, fullName, contactNumber, password].some((field) => field?.trim() === "")
    ) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "All fields are required !!" 
            }
        );
    }

    if(!(usernameValidation.safeParse(username)).success) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Enter username in correct format !!"
            }
        );
    } else if (!(emailValidation.safeParse(email)).success) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Enter mail in correct format !!"
            }
        );
    } else if(!(passwordValidation.safeParse(password)).success) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Enter password in correct format !!"
            }
        );
    }

    const blacklistedEmail = await BlacklistEmails.findAll({
        where: {
            email: email
        }
    })

    if(blacklistedEmail.length !== 0) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You cannot signup as this email has been blacklisted !!"
            }
        );
    }

    const existingUser = await User.findAll({
        where: {
            [Op.or]: {
                username: username,
                email: email
            },
        }
    });

    if(existingUser.length !== 0) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Username or email already exists !!"
            }
        );
    }

    const hashedpassword = await bcrypt.hash(password, 10)

    try {
        const user = await User.create({
            username: username,
            email: email,
            password: hashedpassword,
            fullName: fullName,
            contactNumber: contactNumber
        })
    
        const createdUser = await User.findOne({
            where: {
                id: user.id
            },
            attributes: {
                exclude: ['password', 'refreshToken']
            }
        })
    
        if(!createdUser) {
            return res
            .status(400)
            .json(
                { 
                    success: false, 
                    message: "Something went wrong while registering the user !"
                }
            );
        }
    
        return res
        .status(201)
        .json(
            new ApiResponse(
                200, 
                createdUser,
                "User registered successfully !!"
            )
        )

    } catch (err) {
        console.error("User registration error:");
        console.error("Message:", err.message);

        if (err.original) {
            console.error("Original PG error:", err.original.detail || err.original.message);
        }

        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: err.message 
            }
        );
    }
})

// POST request for logging in the user
const login = asyncHandler( async (req, res) => {
    // ask for email and password
    // check if both parameters came or not 
    // check if the user exists or not 
    // if does not exist then show msg that the username or email is not registered 
    // if exists then check if the password is correct 
    // if wrong password then show msg that wrong password 
    // if correct password then login 

    const {identifier, password} = req.body;

    if(
        [identifier, password].some((field) => field?.trim() === "")
    ) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "All fields are required !!"
            }
        );
    }

    const blacklistedEmail = await BlacklistEmails.findAll({
        where: {
            email: identifier
        }
    })

    if(blacklistedEmail.length !== 0) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You cannot login as this email has been blacklisted !!"
            }
        );
    }

    const checkUser = await User.findOne({
        where: {
            [Op.or]: {
                username: identifier,
                email: identifier,
            },
        }
    })

    if(!checkUser) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "User with this email or username does not exist !"
            }
        );
    }

    if(checkUser.status === "inactive") {
        if(Date.now() < checkUser.isInactiveUntil) {

            const isoDate = new Date(checkUser.isInactiveUntil)

            return res
            .status(400)
            .json(
                { 
                    success: false, 
                    message: `You cannot login because your status has been set to inactive till ${isoDate} !`
                }
            );
        } else {
            const updateUserStatus = await checkUser.update({
                status: "active",
                isInactiveUntil: null
            })

            if(!updateUserStatus) {
                return res
                .status(400)
                .json(
                    { 
                        success: false, 
                        message: "Something went wrong while logging you in !"
                    }
                );
            }
        }
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password)

    if(!checkPassword) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Password is wrong !"
            }
        );
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(checkUser.id);

    const loggedInUser = await User.findByPk(
        checkUser.id,
        {
            attributes: {exclude: ['password', 'refreshToken']}
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser
            },
            "You are logged in successfully !"
        )
    )
    
})

// POST request for loggint out the user
const logout = asyncHandler( async (req, res) => {
    
    await User.update(
        {refreshToken: null},
        {
            where: {
                id: req.user.id
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "you are logged out successfully !"
        )
    )
})

// GET request for fetching the user profile 
const userProfile = asyncHandler( async (req,res) => {
    const user = req.user;

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "User profile fetched successfully !!"
        )
    )
})

// GET request for fetching the list of all the users for the admin
const allUsers = asyncHandler( async (req, res) => {
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

    const allUser = await User.findAll({
        order: [
            ['id', "ASC"]
        ]
    });

    // allUser is an array where User named object is there at every index equals to the number of the user
    // so loop on the allUser and access each element of it (User) and it has stored data in it in dataValues field
    // which itself is an object and all the attributes are there in it.

    // for(let i = 0; i < allUser.length; i++) {
    //     console.log(allUser[i].dataValues.username);
    //     console.log(allUser[i].dataValues.email);
    //     console.log("-------------------")
    // }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allUser,
            "all users profile fetched successfully !!"
        )
    )
})

// GET request for fetching the admin profile 
const adminProfile = asyncHandler( async (req, res) => {
    const user = req.user

    if(!user.isAdmin) {
        return res
        .status(401)
        .json(
            { 
                success: false, 
                message: "You are not admin !!"
            }
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Admin profile fetched successfully !!"
        )
    )
})

// DELETE request for deleting the user from the database (can only be done by the admin)
const removeUser = asyncHandler( async (req, res) => {
    const user = req.user

    if(!user.isAdmin) {
        return res
        .status(401)
        .json(
            { 
                success: false, 
                message: "You are not admin, so you can't delete the user from the database !!"
            }
        );
    }

    const {userId} = req.body;

    if(!userId) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please provide some id for deleting the user !!"
            }
        );
    }

    if(userId === user.id) {
        return res
        .status(400)
        .json(
            {
                success: false,
                message: "You cannot delete your account !!"
            }
        )
    }

    const notExistingUserId = await User.findAll({
        where: {
            id: userId
        }
    })

    if(notExistingUserId.length === 0) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Such userId does not exist, so it can't be deleted !!"
            }
        );
    }

    const deletedUserId = await User.destroy({
        where: {
            id: userId
        }
    })

    if(!deletedUserId) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while deleting the user !!"
            }
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Successfully deleted the user from the database !!"
        )
    )
})

// PATCH request for updating the details of the user (can only be done by the admin)
const updateUserDetails = asyncHandler( async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are not admin, so you can't update the email of the user !!"
            }
        );
    }

    const{ email, userId } = req.body

    if(email?.trim() === "") {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please enter the desired email you want to change to !!"
            }
        );
    }

    const result = emailValidation.safeParse(email);

    if(!result.success) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please enter a valid email !!"
            }
        );
    }

    if(!userId) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please enter the userId whose email you want to change !!"
            }
        );
    }

    if(Number(userId) === Number(user.id)) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Go to your profile page for updating your details, here you can only change the details of the other users !!"
            }
        );
    }

    const existingUser = await User.findOne({
        where: {
            id: userId
        }
    })

    if(!existingUser) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "No such user exist, whose email you are trying to update !!"
            }
        );
    }

    const sameEmailExisting = await User.findOne({
        where: {
            email: email
        }
    })

    if(sameEmailExisting) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "This email already exists !!"
            }
        );
    }

    const userToBeUpdated = await existingUser.update(
        {
            email: email
        }
    )

    if(!userToBeUpdated) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while updating the email of the user !!"
            }
        );
    }

    const updatedUser = await User.findOne({
        where: {
            id: userId
        },
        attributes: {
            exclude: ['password', 'refreshToken']
        }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedUser,
            "User email updated successfully !!"
        )
    )
})

// PATCH request for updating the details of the user 
const updateDetails = asyncHandler( async (req, res) => {
    const user = req.user;

    const{fullName, contactNumber} = req.body

    if(
        fullName.trim() === "" && !contactNumber
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

    if(fullName.trim() === "") {
        const updateUser = await user.update({
            contactNumber: contactNumber
        })

        if(!updateUser) {
            return res
            .status(500)
            .json(
                { 
                    success: false, 
                    message: "Something went wrong while updating the user details !!"
                }
            );
        }
    } else if(!contactNumber) {
        const updateUser = await user.update({
            fullName: fullName
        })

        if(!updateUser) {
            return res
            .status(500)
            .json(
                { 
                    success: false, 
                    message: "Something went wrong while updating the user details !!"
                }
            );
        }
    } else {
        const updateUser = await user.update({
            fullName: fullName,
            contactNumber: contactNumber
        })

        if(!updateUser) {
            return res
            .status(500)
            .json(
                { 
                    success: false, 
                    message: "Something went wrong while updating the user details !!"
                }
            );
        }
    }

    const updatedUser = await User.findOne({
        where: {
            email: user.email
        },
        attributes: {
            exclude: ['password', 'refreshToken']
        }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedUser,
            "Details updated successfully !!"
        )
    )
})

// POST request for making someone admin (can be done by another admin only)
const makeAdmin = asyncHandler( async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are not admin, so you can't make someone admin !!"
            }
        );
    }

    const {userId} = req.body;

    if(!userId) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please send the userId of the user to whom you want to make admin  !!"
            }
        );
    }

    if(userId === (user.id).toString()) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are already an admin !!"
            }
        );
    }

    const existingUser = await User.findOne({
        where: {
            id: userId
        }
    })

    if(!existingUser) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "User with this Id does not exist, please enter a valid userId !!"
            }
        );
    }

    if(existingUser.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "User is already an admin !!"
            }
        );
    }

    const updatedUser = await existingUser.update({
        isAdmin: true,
    })

    if(!updatedUser) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while making the user an admin !!"
            }
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "User became admin successully !!"
        )
    )
})

// POST request for removing someone from admin (can be done by another admin only)
const removeAdmin = asyncHandler( async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are not admin, so you can't remove someone from the admin position !!"
            }
        );
    }

    const {userId} = req.body;

    if(!userId) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please send the userId of the user to whom you want to remove from the admin position !!"
            }
        );
    }

    const existingUser = await User.findOne({
        where: {
            id: userId
        }
    })

    if(!existingUser) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "User with this Id does not exist, please enter a valid userId !!"
            }
        );
    }
    
    if(Number(userId) === Number(user.id)) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You cannot remove yourself from the admin position !!"
            }
        );
    }
    
    if(Number(userId) === Number(1)) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You can't remove this admin !!"
            }
        );
    }

    if(!existingUser.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "User is already not an admin !!"
            }
        );
    }

    const updatedUser = await existingUser.update({
        isAdmin: false,
    })

    if(!updatedUser) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while removing the user from the admin position !!"
            }
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "User removed from the admin position successfully !!"
        )
    )
})

// POST request for making the status inactive of a user
const statusInactive = asyncHandler(async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are not admin, so you can't change someone else's status !!"
            }
        );
    } 

    const {userId, inactiveUntil} = req.body;

    if(!userId) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please send the userId of the user to whom you want to make inactive !!"
            }
        );
    }

    if(!inactiveUntil) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please send the time also until which you want to make the user inactive !!"
            }
        );
    }

    const checkUser = await User.findOne({
        where: {
            id: userId
        }
    })

    if(!checkUser) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "No such user exists in the database whose status you want to change !!"
            }
        );
    }

    if(checkUser.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "you cannot make a admin inactive !!"
            }
        );
    }

    if(checkUser.status === "inactive") {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "User status is already set to inactive !!"
            }
        );
    }

    const updatedUser = await checkUser.update({
        status: "inactive",
        isInactiveUntil: inactiveUntil
    })

    if(!updatedUser) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while updating the status of the user !!"
            }
        );
    }

    const isoDate = new Date(inactiveUntil);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            `successfully changed the status of the user as inactive till : ${isoDate} !!`
        )
    )
})

// POST request for making the status active of a user
const statusActive = asyncHandler(async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are not admin, so you can't change someone else's status !!"
            }
        );
    } 

    const {userId} = req.body;

    if(!userId) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Please send the userId of the user to whom you want to make inactive !!"
            }
        );
    }

    const checkUser = await User.findOne({
        where: {
            id: userId
        }
    })

    if(!checkUser) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "No such user exists in the database whose status you want to change !!"
            }
        );
    }

    if(checkUser.status === "active") {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "User status is already set to active !!"
            }
        );
    }

    const updatedUser = await checkUser.update({
        status: "active",
        isInactiveUntil: null
    })

    if(!updatedUser) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while updating the status of the user !!"
            }
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            `successfully changed the status of the user as active !!`
        )
    )
})

// POST request for checking the details sent by the user in request for updating the email
const checkRequestDetails = asyncHandler(async (req, res) => {
    const user = req.user;

    if(user.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are admin you can directly change your email, no need to make request !!"
            }
        );
    }

    const {desiredEmail, password, userId} = req.body

    if(
        [desiredEmail, password].some((field) => field.trim() === "") || !userId
    ) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Pls fill all the required details before making a request !!"
            }
        );
    }

    if(Number(userId) !== Number(user.id)) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Incorrect userId sent (as the user id sent with the request and the user id that the logged in user has are not same) !!"
            }
        );
    }

    const checkUser = await User.findOne({
        where: {
            id: userId
        }
    })

    if(!checkUser) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "No such user exists with this user id, so you can't make any request !!"
            }
        );
    }

    const alreadyRequestMade = await Request.findAll({
        where: {
            requestedById: user.id
        }
    })

    if(alreadyRequestMade.length !== 0) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You cannot make more than one request for email change !!"
            }
        );
    }

    const checkPassword = await bcrypt.compare(password, checkUser.password)

    if(!checkPassword) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Password is wrong !"
            }
        );
    }

    if (!(emailValidation.safeParse(desiredEmail)).success) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "Enter a valid email !!"
            }
        );
    }

    const existingEmail = await User.findAll({
        where: {
            email: desiredEmail
        }
    })

    if(existingEmail.length !== 0) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "The email entered is already taken, pls try any other email !!"
            }
        );
    }

    const existingRequestedEmail = await Request.findAll({
        where: {
            email: desiredEmail
        }
    })

    if(existingRequestedEmail.length !== 0) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "This email is already requested by someone else !!"
            }
        );
    }

    try {
        const createRequest = await Request.create({
            email: desiredEmail,
            requestedByName: user.fullName,
            requestedById: user.id
        })
    
        if(!createRequest) {
            return res
            .status(400)
            .json(
                { 
                    success: false, 
                    message: "Something went wrong while creating the request !!"
                }
            );
        }
    
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createRequest,
                "Successfully created the request, pls wait until it gets approved by the admin !!"
            )
        )
    } catch (err) {
        console.error("Request creation error :");
        console.error("Message:", err.message);

        if (err.original) {
            console.error("Original PG error:", err.original.detail || err.original.message);
        }

        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: err.message 
            }
        );
    }
})

// GET request for fetching all the request for the admin 
const allRequests = asyncHandler(async (req, res) => {
    const user = req.user

    if(!user.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are not admin, so you can't see all the requests !!"
            }
        );
    }

    const allFetchedRequests = await Request.findAll({
        order: [
            ['id', "ASC"]
        ]
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allFetchedRequests,
            "all requests fetched successfully !!"
        )
    )
})

// POST request for approving the request made by the user for email updation
const approveRequest = asyncHandler(async (req, res) => {
    const user = req.user

    if(!user.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are not admin so you cannot approve anyone's request !!"
            }
        );
    }

    const {desiredEmail, userId} = req.body

    const existingEmail = await User.findAll({
        where: {
            email: desiredEmail
        }
    })

    if(existingEmail.length !== 0) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "This email is already taken, pls reject this request and notify the user regarding the same !!"
            }
        );
    }

    const updatedUser = await User.update(
        {
            email: desiredEmail 
        },
        {
            where: {
                id: userId
            },
        },
    )

    if(!updatedUser) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while updating the user email !!"
            }
        );
    }

    await Request.destroy({
        where: {
            email: desiredEmail
        }
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "User email updated successfully  !!"
        )
    )
})

const rejectRequest = asyncHandler(async (req, res) => {
    const user = req.user;

    if(!user.isAdmin) {
        return res
        .status(400)
        .json(
            { 
                success: false, 
                message: "You are not admin so you cannot reject anyone's request !!"
            }
        );
    }

    const {desiredEmail} = req.body

    const checkEmail = await Request.findAll({
        where: {
            email: desiredEmail
        }
    })

    if(checkEmail.length === 0) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "no such email exists in the request table, so it can't be deleted !!"
            }
        );
    }

    const deletedRequest = await Request.destroy({
        where: {
            email: desiredEmail
        }
    })

    if(!deletedRequest) {
        return res
        .status(500)
        .json(
            { 
                success: false, 
                message: "Something went wrong while rejecting the request !!"
            }
        );
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Request rejected successfully  !!"
        )
    )
})

export {
    register,
    login,
    logout,
    userProfile,
    allUsers,
    removeUser,
    adminProfile,
    updateUserDetails,
    updateDetails,
    removeAdmin,
    makeAdmin,
    statusInactive,
    statusActive,
    checkRequestDetails,
    allRequests,
    approveRequest,
    rejectRequest
}