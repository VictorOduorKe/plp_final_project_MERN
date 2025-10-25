const mongoose = require("mongoose");

const quizesSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subject_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },
        quizes:{type:JSON, required:true}
    },
    {timestamps:true}
);

const Quizes=mongoose.model("Quizes",quizesSchema);

module.exports=Quizes;

