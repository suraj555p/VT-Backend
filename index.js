import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import { ConnectDB } from "./db/Db.js";
import UserRouter from "./Routes/User.route.js";
import VideoRouter from "./Routes/Video.route.js"
import CommentRouter from "./Routes/Comment.route.js"
import SubscriptionRouter from "./Routes/Subscription.route.js"

dotenv.config();

ConnectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', // allow only frontend origin
  'https://vt-frontend-ebon.vercel.app'],
  credentials: true // allow cookies (if using authentication via cookies)
}));

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/videos",VideoRouter);
app.use("/api/v1/comments",CommentRouter)
app.use("/api/v1/subscriptions",SubscriptionRouter)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { app };
