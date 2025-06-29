import { Router } from "express";
import { verifyJWT } from "../Middlewares/Authentication.js";
import { addComment, deleteCommentById, getAllComments } from "../Controllers/Comment.controller.js";

const router = Router()

router.route("/addComment").post(verifyJWT,addComment)
router.route("/getAllComments").get(getAllComments)
router.route("/deleteComment/:commentId").delete(verifyJWT,deleteCommentById)

export default router