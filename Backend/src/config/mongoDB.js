import mongoose from "mongoose";

import 'dotenv/config'; 

const connectDB=async()=>{
   try {
     mongoose.connection.on('connected',()=>{
         console.log("DB connected")
     })
     await mongoose.connect(`${process.env.MONGODB_URL}`)
   } catch (error) {
    console.log("MongoDb Err",error)
   }
}

export default connectDB