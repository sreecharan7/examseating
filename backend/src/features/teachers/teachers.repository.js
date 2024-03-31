import mongoose from "mongoose";
import { teacherSchema} from "./teachers.schema.js";
import {customError} from "../../middlewares/error.middleware.js"

const teacherModel=mongoose.model("teachers",teacherSchema);

export class TeachersRepository{
    addMultipleTeachers=async (teachers)=>{
        try{
            const result=await teacherModel.insertMany(teachers);
            return result;
        }catch(error){
            throw new customError(400,"Error in adding teachers");
        }
    }
    checkTeacherArray=async (array)=>{
        try{
            const foundUsers = await teacherModel.find({ _id: { $in: array } });
            return foundUsers;
        }catch(err){
            throw new customError(500,"something went wrong while checking teachers");
        }
    }
    getTeacherByuserID=async (userId)=>{
        try{
            const teacher=await teacherModel.findOne({userId:userId});
            return teacher;
        }catch(err){
            throw new customError(500,"something went wrong while checking teachers");
        }
    }
    getAllTeachers=async ()=>{
        try{
            const teachers=await  teacherModel.find();
            return teachers;
        }catch(err){

        }
    }
}