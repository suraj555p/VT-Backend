import mongoose from "mongoose";
import { Comment } from "../Models/Comment.model.js";

const addComment = async (req,res)=>{
 try {
     const currentUser = req.user
     const {text,video} = req.body

     console.log(currentUser);
     

     const commentAdded =  await Comment.create({
        user : currentUser._id,
        text,
        video
     })

     const populateComment = await Comment.findById(commentAdded._id).populate('user','username fullname avatarImage')

     return res.status(201).json({
        comment: populateComment,
        message : "Comment added Successfully !!!"
     })
 } catch (error) {
     console.log("Server error !!!");
     return res.status(500).json({
        message : "Something went wrong !!!"
     })
 }
}

const getAllComments = async(req,res)=>{
    try {
         const AllComments = await Comment.find().populate('user','fullname username avatarImage')

         return res.status(201).json({
            AllComments,
            message : "All Comments has been fetched successfully !!!"
         })

    } catch (error) {
       return res.status(500).json({
         message: `server error : ${error}`
       })
        
    }
}

const deleteCommentById = async(req,res)=>{
   try {
        const {commentId}=req.params

        if(!commentId){
           return res.status(400).json({
            message: "comment id is required !!!"
       }) }

       const comment = await Comment.findById(commentId)

       if(!comment){
          return res.status(404).json({
             message: "comment not found !!!"
          })
       }

       if( req.user._id.toString() != comment.user.toString()){
           return res.status(400).json({
             message : "this is not your comment !!!"
           })
      }

      await comment.deleteOne()
      
      return res.status(201).json({
          message : "comment deleted successfully !!!"
      })
   } catch (error) {
       return res.status(500).json({
          message : "server error !!!"
       })
   }
}

export {
    addComment,
    getAllComments,
    deleteCommentById
}