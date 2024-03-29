import mongoose from "mongoose";
import { teacherSchema} from "./teachers.schema.js";
import {customError} from "../../middlewares/error.middleware.js"

const teaacherModel=mongoose.model("teachers",teacherSchema);

export class TeachersRepository{
    addMultipleTeachers=async (teachers)=>{
        try{
            const result=await teaacherModel.insertMany(teachers);
            return result;
        }catch(error){
            throw new customError(400,"Error in adding teachers");
        }
    }
    checkTeacherArray=async (array)=>{
        try{
            const foundUsers = await teaacherModel.find({ _id: { $in: array } });
            return foundUsers;
        }catch(err){
            throw new customError(500,"something went wrong while checking teachers");
        }
    }
}