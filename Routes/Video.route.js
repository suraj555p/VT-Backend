import { Router } from "express";
import { verifyJWT } from "../Middlewares/Authentication.js";
import { upload } from "../Middlewares/Multer.js";
import { getAllVideos, uploadVideo, getVideoById, getAllUserVideos, deleteVideo } from "../Controllers/Video.controller.js";

const router = Router()

router.route("/uploadVideo").post(verifyJWT,upload.fields([
    { name : 'thumbnail', maxCount : 1},
    {   name : 'video', maxCount : 1 },
]), uploadVideo)
router.route("/getAllVideos").get(getAllVideos)
router.route("/getVideosById/:_id").get(getVideoById)
router.route("/getAllUserVideos").get(verifyJWT,getAllUserVideos)
router.route("/deleteVideo/:_id").delete(verifyJWT,deleteVideo)
export default router