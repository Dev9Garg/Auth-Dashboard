import express from "express";
import cors from "cors";
import cookieParse from "cookie-parser"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParse())

// routes import 
import userRouter from "./routes/user.route.js"
import adminRouter from "./routes/admin.route.js"

app.use("/api/v1/users", userRouter)

app.use("/api/v1/admin", adminRouter)

export {app};