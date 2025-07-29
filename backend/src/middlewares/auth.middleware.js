import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJWT = asyncHandler( async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            res
            .status(401)
            .json(
                { 
                    success: false, 
                    message: "Unauthorized access !"
                }
            );
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findByPk(decodedToken?.id, {
            attributes: {exclude: ['password', 'refreshToken']}
        })

        if(!user) {
            res
            .status(401)
            .json(
                { 
                    success: false, 
                    message: "Invalid access token !"
                }
            );
        }

        req.user = user;
        next();
    } catch (error) {
        res
        .status(401)
        .json(
            { 
                success: false, 
                message: error?.message || "Invalid access token"
            }
        );
    }
})