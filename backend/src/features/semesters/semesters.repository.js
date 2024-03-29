import mongoose from 'mongoose';
import { SemesterSchema } from './semesters.schema.js';
import {customError} from "../../middlewares/error.middleware.js"


const semesterModel=mongoose.model("semesters",SemesterSchema);

export class SemesterRepositroy{
    addMultipleSemesters=async(semesters)=>{
        try{
            const result=await semesterModel.insertMany(semesters);
            return result;
        }catch(err){
            console.log(err);
            throw new customError(500,"something went wrong while adding semester");
        }
    }
    checkMultipleWithNameAndStudentId=async(data)=>{
        try{
            const result = await semesterModel.find({$or:data});
            return result;
        }catch(err){
            console.log(err);
            throw new customError(500,"something went wrong while checking semester");
        }
    }
};