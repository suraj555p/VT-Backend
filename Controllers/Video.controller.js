import Video from "../Models/Video.model.js"
import { User } from "../Models/User.model.js"
import { uploadOnCloudinary } from "../Utils/Cloudinary.js"
import { v2 as cloudinary } from "cloudinary"
import mongoose from "mongoose"

const uploadVideo = async(req,res)=>{
    try {
        const {title,description} = req.body

        const currentUser = req.user

        if(!currentUser){
             return res.status(400).json({
                message : "please login before video upload !!!"
            })
        }

        if(!title){
            return res.status(400).json({
                message : "video title is required !!!"
            })
        }

        const thumbnailPath = req.files.thumbnail[0].path
        const videoPath = req.files.video[0].path

        if(!thumbnailPath){
             return res.status(400).json({
                message : "thumbnail is required !!!"
            })
        }

        if(!videoPath){
             return res.status(400).json({
                message : "video is required !!!"
            })
        }

        const thumbnail = await uploadOnCloudinary(thumbnailPath,'image')
        const video = await uploadOnCloudinary(videoPath,'video')

        const videoUploadDetails = await Video.create({
            user : currentUser,
            title,
            description,
            video : video.url,
            thumbnail : thumbnail.url
        })

        return res.status(201).json({
            currentUser , 
            videoUploadDetails,
            message : "Video uploaded successfully !!!"
        })

    } catch (error) {
        console.log("Server error !!!");
         
    }

}

const getAllVideos = async (req,res)=>{
    try {
        const allVideos = await Video.find().populate('video user','username avatarImage title thumbnail video')
        return res.status(201).json({
            "All videos ": allVideos
        })
    } catch (error) {
        console.log("Server error !!!");
        
    }
}

const getVideoById = async (req,res)=>{
    try {
         const {_id} = req.params
         const userVideos = await Video.findById({_id}).populate('video user','username avatarImage title thumbnail video')
         return res.status(201).json({
            "particular User videos ": userVideos
        })
    } catch (error) {
        console.log("Server error !!!");
        
    }
}

const getAllUserVideos = async (req,res)=>{
    try {
         const currentUser = req.user._id
         const userVideos = await Video.find({user : currentUser})

         if(!userVideos)
         {
             return res.status(404).json({
                message : "Something went wrong during fetching the all user videos !!!"
             })
         }

         return res.status(201).json({
            userVideos,
            message : "videos are fetched successfully !!!"
         })
    } catch (error) {
        return res.status(500).json({
            message : `Server error : ${error}`
        })
    }
}

const deleteVideo = async (req,res)=>{
    try {
          const _id = req.params

            if(!_id){
             return res.status(400).json({
                 message : "video id is required !!!"
             })
          }

          const userVideo = await Video.findById(_id)

          if(!userVideo){
             return res.status(400).json({
                 message : "video not found !!!"
             })
          }
           
          
          if(req.user._id.toString() !== userVideo.user.toString())
          {
             return res.status(404).json({
                 message: "this is not a current user video !!!"
             })
          }

          if(userVideo.video){
            await cloudinary.uploader.destroy(userVideo.video,{
                resource_type: "video"
            });
          }

          await userVideo.deleteOne()

          return res.status(201).json({
             message: "video deleted successfully !!!"
          })

    } catch (error) {
        return res.status(500).json({
            message : ` server error : ${error}`
        })
    }
}

export {
    uploadVideo,
    getAllVideos,
    getVideoById,
    getAllUserVideos,
    deleteVideo
}