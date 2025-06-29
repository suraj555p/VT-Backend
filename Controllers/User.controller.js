import { User } from "../Models/User.model.js";
import { Subscription } from "../Models/Subscription.model.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { uploadOnCloudinary } from "../Utils/Cloudinary.js";


const register = async(req,res)=>{
  const {username,fullname,email,password}=req.body

  if(!username || !fullname || !email || !password){
    return res.status(400).json({
        message : "All fiels are required"
    })
  }

  const existuser = await User.findOne({
     $or : [{username},{email}]
  })

  if(existuser){
     return res.status(409).json({
        message : "user already exist !!!"
     })
  }

  console.log(req.files);

   const avatarImagePath = req.files.avatarImage[0].path;
      const coverImagePath = req.files.coverImage[0].path;

        console.log(avatarImagePath);
      console.log(coverImagePath);
  
     const avatarImage =  await uploadOnCloudinary(avatarImagePath,'image');
      const coverImage =  await uploadOnCloudinary(coverImagePath,'image') ;


  const encryptPassword= await bcrypt.hash(password,10)
  //console.log("password",encryptPassword);
  

  const createdUser = await User.create({
    username,
    email,
    fullname,
    avatarImage: avatarImage.url ,
    coverImage : coverImage.url ,
    password: encryptPassword
  })

  if(!createdUser){
    return res.status(500).json({
        message: "Something went wrong while creating a new user !!!"
    })
  }

  return res.status(201).json({
    createdUser ,
    message : "User created successfully !!!"
  })

}

 const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Credentials cannot be empty!" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(409).json({ message: "Password is incorrect!" });
    }

    const token =  jwt.sign(
      { userId: user._id },
      process.env.TOKEN,
    );

    console.log(token);
    

  const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
};


    const { _id, username: uname, email , avatarImage} = user;

    return res.status(201).cookie('token', token, options).json({
      user: { id: _id, username: uname, email, avatarImage },
      token,
      message: "User logged in successfully!"
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
};

const logout = async (req, res) => {
  const options = {
  httpOnly: true,
  secure: true,
    sameSite: "None", // recommended for auth
};

  return res.status(200).clearCookie("token", options).json({
    message: "Logout Successfully !!!"
  });
};

const getCurrentUserChannelProfile = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Find current user by ID
    const user = await User.findById(currentUserId).select(
      "fullname username email avatarImage coverImage"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Count total subscribers (people who follow me)
    const subscribersCount = await Subscription.countDocuments({ channel: currentUserId });

    // Count total channels I'm subscribed to
    const subscribedToCount = await Subscription.countDocuments({ subscriber: currentUserId });

    return res.status(200).json({
      message: "Current user channel profile fetched successfully!",
      channel: {
        ...user.toObject(),
        subscribersCount,
        channelSubscribedToCount: subscribedToCount,
        isSubscribed: false, // always false for own profile
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching the current user's channel profile!",
      error: error.message,
    });
  }
};

const getUserChannelProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user._id;

    if (!username?.trim()) {
      return res.status(400).json({ message: "Username is missing!" });
    }

    // Find the user by username
    const user = await User.findOne({ username }).select(
      "fullname username email avatarImage coverImage"
    );

    if (!user) {
      return res.status(404).json({ message: "Channel does not exist!" });
    }

    const channelUserId = user._id;

    // Count total subscribers and subscriptions
    const subscribersCount = await Subscription.countDocuments({ channel: channelUserId });
    const subscribedToCount = await Subscription.countDocuments({ subscriber: channelUserId });

    // Check if current user is subscribed to this channel
    const isSubscribed = await Subscription.exists({
      subscriber: currentUserId,
      channel: channelUserId,
    });

    return res.status(200).json({
      message: "User channel fetched successfully!",
      channel: {
        ...user.toObject(),
        subscribersCount,
        channelSubscribedToCount: subscribedToCount,
        isSubscribed: Boolean(isSubscribed),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while fetching the user's channel profile!",
      error: error.message,
    });
  }
};

const changeAvatarImage = async (req,res)=>{
   try {
        const avatarImagePath = req.files.avatarImage[0].path
        console.log("avatarImagePath : ",avatarImagePath);
        
        const avatarImage = await uploadOnCloudinary(avatarImagePath,'image')

        if(!avatarImage){
          return res.status(400).json({
            message : "error occurred while uploading the avatarImage !!!"
          })
        }

        const currentUser = await User.findByIdAndUpdate(
          req.user._id ,
          {
             $set : {
               avatarImage : avatarImage.url
             }
          },
          {new : true}
        )

        return res.status(200).json({
           currentUser,
           message: "avatar Image uploaded successfully !!!"
        })

   } catch (error) {
     return res.status(500).json({
      message : "something went wrong during uploading the avatar Image !!!"
     })
   }
}

const changeCoverImage = async (req,res)=>{
   try {
        const coverImagePath = req.files.coverImage[0].path
        console.log("coverImagePath : ",coverImagePath);
        
        const coverImage = await uploadOnCloudinary(coverImagePath,'image')

        if(!coverImage){
          return res.status(400).json({
            message : "error occurred while uploading the coverImage !!!"
          })
        }

        const currentUser = await User.findByIdAndUpdate(
          req.user._id ,
          {
             $set : {
               coverImage : coverImage.url
             }
          },
          {new : true}
        )

        return res.status(200).json({
           currentUser,
           message: "cover Image uploaded successfully !!!"
        })

   } catch (error) {
     return res.status(500).json({
      message : "something went wrong during uploading the cover Image !!!"
     })
   }
}

const changePassword = async (req,res)=>{
  try {
       const {oldpassword,newpassword}=req.body
       
       if(!oldpassword || !newpassword){
         return res.status(400).json({
           message : "input fields are missing !!!"
         })
       }

        const encryptPassword = await bcrypt.hash(newpassword,10) 
       const isPasswordCorrect = await bcrypt.compare(oldpassword,req.user.password)

       if(!isPasswordCorrect)
      {
          return res.status(404).json({
             message: "your old password is not match with current password !!!"
          })
      }

      await User.findByIdAndUpdate(
        req.user._id,
        {
           $set : {password : encryptPassword}
        },
        {new : true}
      )

      return res.status(201).json({
         message : "password has been changed successfully !!!"
      })
  } catch (error) {
     return res.status(500).json({
       message : `server error : ${error}`
     })
     
  }
}


export {
    register,
    login,
    logout,
    getUserChannelProfile,
    getCurrentUserChannelProfile,
    changeAvatarImage,
    changeCoverImage,
    changePassword
}