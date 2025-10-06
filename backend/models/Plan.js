const mongoose = require("mongoose")

const planSchema = new mongoose.Schema(
    {
        subject_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan:{type:JSON,required:true},
        status:{
            type:String,
            enum:["pending","todo","complete"],
            default:"todo"
        }
    },{timestamps:true}
);

const Plan=mongoose.model("Plan",planSchema);

module.exports=Plan;