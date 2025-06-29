import mongoose,{Schema} from "mongoose";

const SubscriptionSchema = new Schema({
    subscriber :{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    channel : {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
   /* subscribersCount: {
    type: Number,
    default: 0
  },
  subscribedChannelCount: {
     type: Number,
     default: 0
  }*/
},{timestamps: true})

SubscriptionSchema.index({subscriber:1 , channel:1},{unique: true})

export const Subscription = mongoose.model("Subscription",SubscriptionSchema)