import mongoose from "mongoose";

export const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true
    },
    about: {
        type: String,
        required: true
    }
})