import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import {hideConsoleLogInProduction} from "./lib/helper.js";
export async function dbConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    hideConsoleLogInProduction("✅ Database connected");
  } catch (error) {
    hideConsoleLogInProduction("❌ Error occurred:", error);
  }
}
