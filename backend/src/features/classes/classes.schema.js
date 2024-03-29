import { name } from "ejs";
import mongoose from "mongoose";


export const classSchema = new mongoose.Schema({
    structure:{
        type:[[Number]],
        required:true
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    noOfTeacherRequired:{
        type:Number,
        required:true
    },
});