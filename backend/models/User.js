const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name must be less than 50 characters"],
      match: [/^[A-Za-z]+$/, "First name must contain only letters"]
    },
    second_name: {
      type: String,
      required: [true, "Second name is required"],
      minlength: [2, "Second name must be at least 2 characters"],
      maxlength: [50, "Second name must be less than 50 characters"],
      match: [/^[A-Za-z]+$/, "Second name must contain only letters"]
    },
    phone_number: {
      type: String, // store as string to preserve leading zeros
      required: [true, "Phone number is required"],
      match: [/^(?:07|01)\d{8}$/, "Phone number must be exactly 10 digits"] // adjust regex if needed
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must contain uppercase, lowercase, number, and special character"
      ]
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
