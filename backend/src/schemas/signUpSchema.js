import * as z from "zod"

export const usernameValidation = z
    .string()
    .min(5, {error: "Username is too short, length must be atleast of 5 characters !!"})
    .max(20, {error: "Username is too big, length must be less than 20 characters !!"})
    .regex(/^[a-zA-Z0-9_]+$/, {error: "Username must not contain any special character !!"})

export const passwordValidation = z
    .string()
    .min(6, {error: "Password length must be atleast of 6 characters !!"})
    .max(12, {error: "Password length must be less than 12 characters !!"})
    .regex(/[a-z]/, {error: "Password must contain atleast one lowercase letter !!"})
    .regex(/[A-Z]/, {error: "Password must contain atleast one uppercase letter !!"})
    .regex(/[0-9]/, {error: "Password must contain atleast one number !!"})
    .regex(/[^a-zA-Z0-9]/, {error: "Password must contain atleast one special character !!"})

export const emailValidation = z.email({error: "Pls enter a valid email !!"})

export const contactNumberValidation = z
    .string()
    .max(10)
    .min(10)


export const signUpValidation = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation,
    contactNumber: contactNumberValidation
})