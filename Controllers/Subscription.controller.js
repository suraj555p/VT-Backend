import mongoose from "mongoose";
import { Subscription } from "../Models/Subscription.model.js";

const subscribe = async(req,res)=>{
 try {
       const currentUser = req.user._id
       const {targetUser} = req.params
       
       if(!targetUser){
        return res.status(400).json({
         message : "channel is not found !!!"
           })
       }

       if(currentUser.toString()==targetUser.toString()){
            return res.status(404).json({
            message : "you cannot subscribe to yourself !!!"
            })
       }

     const alreadySubscribed = await Subscription.findOne({
      subscriber: currentUser,
      channel: targetUser,
    });

    if (alreadySubscribed) {
      return res.status(400).json({
        message: "You are already subscribed to this channel.",
      });
    }

       const subscribed = await Subscription.create({
         subscriber : currentUser,
         channel : targetUser
       })

    const subscribersCount = await Subscription.countDocuments({ channel: targetUser });
    const subscribedChannelCount = await Subscription.countDocuments({ subscriber: currentUser });

        return res.status(201).json({
           subscribed,
           subscribersCount,
           subscribedChannelCount,
           message : "subscribed successfully !!!"
        }) 
       
 } catch (error) {
    return res.status(500).json({
         message : `server error : ${error}`
    })
 }
}

const unsubscribe = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const { targetUser } = req.params;


    if (!mongoose.Types.ObjectId.isValid(targetUser)) {
      return res.status(400).json({ message: "Invalid channel ID!" });
    }

    if (!targetUser) {
      return res.status(400).json({
        message: "Channel is not found!",
      });
    }

    if (currentUser.toString() === targetUser.toString()) {
      return res.status(400).json({
        message: "You cannot unsubscribe from yourself!",
      });
    }

    const unsubscribed = await Subscription.findOneAndDelete({
      subscriber: currentUser,
      channel: targetUser,
    });

    if (!unsubscribed) {
      return res.status(404).json({
        message: "You are not subscribed to this channel.",
      });
    }

    const subscribersCount = await Subscription.countDocuments({ channel: targetUser });
    const subscribedChannelCount = await Subscription.countDocuments({ subscriber: currentUser });

    return res.status(200).json({
      subscribersCount,
      subscribedChannelCount,
      message: "Unsubscribed successfully!",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};


export {
   subscribe,
   unsubscribe
}