import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDb connected !! DB HOST:` )
    } catch(e){
        console.log("Error connecting to the database: ", e)
        process.exit(1)
    }
}
export default connectDB;