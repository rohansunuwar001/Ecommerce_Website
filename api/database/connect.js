import mongoose from "mongoose";
import { databasePath } from "../utils/constant.js";

let connectDB = () => {
  mongoose.connect(databasePath).then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`)
  }
  )
}

export default connectDB;