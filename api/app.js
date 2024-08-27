import express from "express";
import authroute from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";

import messageRoute from "./routes/message.route.js";
import chatRoute from "./routes/chat.route.js"

dotenv.config({path:"./.env"});
 

const app=express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
res.send("hello");
});

app.use("/api/auth",authroute);
app.use("/api/test",testRoute);
app.use("/api/users",userRoute);
app.use("/api/posts",postRoute);
app.use("/api/chats",chatRoute);
app.use("/api/messages",messageRoute);


app.listen(8800,()=>{
    console.log("server is listening");
})