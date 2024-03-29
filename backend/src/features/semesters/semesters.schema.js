import mongoose from "mongoose"

export const SemesterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    isCurrent: {
        type: Boolean,
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true,
    },
    payment:{
        type: Boolean,
        required: true,
        default: false, 
    }
});