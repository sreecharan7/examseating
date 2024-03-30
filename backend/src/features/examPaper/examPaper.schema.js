import mongoose from "mongoose";

export const examPaperSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams",
        required: true,
    },
    couseCode: {
        type: String,
        required: true,
    },
    paper:{
        type: String,
        required: true,
    }
});