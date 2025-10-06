import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


export async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Error occurred:", error);
  }
}
