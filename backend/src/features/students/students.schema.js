import e from "express";
import mongoose from "mongoose";

export const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    rollNo:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles',
        required: true,
        unquie:true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
})