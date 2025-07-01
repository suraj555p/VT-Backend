import { Router } from "express";
import { verifyJWT } from "../Middlewares/Authentication.js";
import { getChannels, getSubscriptionStatus, subscribe, unsubscribe } from "../Controllers/Subscription.controller.js";

const router = Router()

router.route("/subscribe/:targetUser").post(verifyJWT,subscribe)
router.route("/unsubscribe/:targetUser").delete(verifyJWT,unsubscribe)
router.route("/status/:targetUser").get(verifyJWT,getSubscriptionStatus)
router.route("/getChannels").get(verifyJWT,getChannels)

export default router