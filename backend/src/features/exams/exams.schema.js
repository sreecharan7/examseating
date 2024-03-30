import mongoose from "mongoose"

export const examSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    classes:{
        type:[String],
        required:true
    },
    courses:{
        type:[String],
        required:true
    },
    examDate:{
        type:Date,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    }
},{timestamps:true});