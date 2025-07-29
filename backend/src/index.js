import dotenv from "dotenv";
dotenv.config({
    path: "./env"
})

import {connectdb} from "./db/index.js";
import {app} from "./app.js"
import {modelSync} from "./models/user.model.js";

connectdb()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`server is running at port ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("Something went wrong while connecting to database : ", err)
})

modelSync();  // uncomment this only when you make some changes in the models, so that database gets synced with that 