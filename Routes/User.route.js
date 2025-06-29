import { Router } from "express";
import { changeAvatarImage, changeCoverImage, changePassword, getCurrentUserChannelProfile, getUserChannelProfile, login, logout,register} from "../Controllers/User.controller.js";
import { verifyJWT } from "../Middlewares/Authentication.js";
import {upload} from "../Middlewares/Multer.js"


const router = Router()

router.route("/register").post(upload.fields([
  { name: 'avatarImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
]),register)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/getUserChannelProfile/:username").get(verifyJWT,getCurrentUserChannelProfile)
router.route("/getAnotherChannelProfile/:username").get(verifyJWT,getUserChannelProfile)
router.patch("/changeAvatarImage", verifyJWT, upload.fields([{name: 'avatarImage', maxCount:1}]), changeAvatarImage);
router.patch("/changeCoverImage", verifyJWT, upload.fields([{name: 'coverImage', maxCount:1}]), changeCoverImage);
router.patch("/changePassword",verifyJWT,changePassword)

export default router