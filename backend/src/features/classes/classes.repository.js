import mongoose from 'mongoose';
import {classSchema} from "./classes.schema.js";

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
            throw new customError(400,"something went adding multiple classes");
        }
    }
}