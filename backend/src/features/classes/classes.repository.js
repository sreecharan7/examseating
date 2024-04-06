import mongoose from 'mongoose';
import {classSchema} from "./classes.schema.js";
import {customError} from "../../middlewares/error.middleware.js";

const classesModel=mongoose.model("classes",classSchema);

export class classesRepositroy{
    addClass=async (name,structure,noOfTeacherRequired)=>{
        try{
            const classes=new classesModel({name,structure,noOfTeacherRequired});
            const result=await classes.save();
            return result;
        }catch(err){
            
            throw new customError(400,"soething went adding classes");
        }
    }
    addMultipleClasses=async (classes)=>{
        try{
            const result=await classesModel.insertMany(classes);
            return result;
        }catch(err){
            throw new customError(400,"Their class exist with the same name");
        }
    }
    checkMultipleClasses=async (names)=>{
        try{
            const result=await classesModel.find({name:{$in:names}});
            return result;
        }catch(err){
            throw new customError(400,"something went checking multiple classes");
        }
    }
}