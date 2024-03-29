import mongoose from 'mongoose';
import { studentSchema } from './students.schema.js';
import { customError } from '../../middlewares/error.middleware.js';

const studentModel=mongoose.model("students",studentSchema);

export class StudentRepository {
    addStudent=async (name,userId,branch,year)=>{
        try{
            if(!name||!userId||!branch||!year){
                throw new customError(400,"name,userId,email,branch,year are required");
            }
            const newStudent=new studentModel({name,userId,branch,year});
            const result=await newStudent.save();
            return result;
        }
        catch(err){
            console.log(err);
            throw new customError(500,"something went wrong while adding student");
        }
    }
    addStudentsMultiple=async (students)=>{
        try{
            const result=await studentModel.insertMany(students);
            return result;
        }
        catch(err){
            throw new customError(500,"something went wrong while adding students");
        }
    }    
    checkStudentArray=async (array,test="_id")=>{
        try{
            const find={};
            find[test]={ $in: array };
            const foundUsers = await studentModel.find(find);
            return foundUsers;
        }catch(err){
            throw new customError(500,"something went wrong while checking student");
        }
    }
}