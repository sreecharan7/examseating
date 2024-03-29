import mongoose from "mongoose"


export const attendanceSchema = new mongoose.Schema({
    semesterId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'semesters',
        required:true
    },
    courseCode:{
        type:String,
        required:true  
    },
    percentage:{
        type:Number,
        required:true,
    }
})