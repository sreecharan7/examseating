import mongoose from 'mongoose';
import {courseSchema } from './coures.schema.js';
import {customError} from "../../middlewares/error.middleware.js"

const couresModel=mongoose.model("coures",courseSchema);

export class CouresRepository{
    addCoures=async (courseName,courseCode,teacherId)=>{
        try{
            const coures=new couresModel({courseName,courseCode,teacherId});
            const result=await coures.save();
            return result;
        }catch(err){
            throw new customError(400,"soething went adding coures");
        }
    }
    addMultipleCourses=async (teachers)=>{
        try{
            const result=await couresModel.insertMany(teachers);
            return result;
        }catch(err){
            throw new customError(400,"something went adding multiple coures");
        }
    }
    checkMultipleCourses=async (courseCodes)=>{
        try{
            const result=await couresModel.find({courseCode:{$in:courseCodes}});
            return result;
        }catch(err){
            throw new customError(400,"something went checking multiple coures");
        }
    }

}