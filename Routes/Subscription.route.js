import { Router } from "express";
import { verifyJWT } from "../Middlewares/Authentication.js";
import { subscribe, unsubscribe } from "../Controllers/Subscription.controller.js";

const router = Router()

router.route("/subscribe/:targetUser").post(verifyJWT,subscribe)
router.route("/unsubscribe/:targetUser").delete(verifyJWT,unsubscribe)

export default router