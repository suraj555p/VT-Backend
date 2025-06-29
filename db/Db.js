import mongoose from "mongoose";

export const ConnectDB = async ()=>{
  try{
      const connection = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log("MongoDB connected successfully !!! ",connection.connection.host);
      
  }
  catch(error){
      console.log("MongoDB connection Failed",error.message);
      
  }
  
}