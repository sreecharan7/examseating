import mongoose from "mongoose";
import {examSchema} from "./exams.schema.js";
import {customError} from "../../middlewares/error.middleware.js"

const examModel=mongoose.model("exams",examSchema);

export class ExamRepository{
    addExam(name,classes,courses,examDate,startTime){
        try{
            return examModel.create({name,classes,courses,examDate,startTime});
        }catch(err){
            throw new customError(400,"something went wrong while adding exam");
        }
    }
    getExamById(id){
        try{
            return examModel.findById(id);
        }catch(err){
            throw new customError(400,"something went wrong while checking exam");
        }
    }
    checkExamByIdAndCouseCode(examId,couseCode){
        try{
            //courses is an array so we can use $in operator to check if couseCode is present in courses array
            return examModel.findOne({_id:examId,courses:{$in:[couseCode]}});
        }
        catch(err){
            throw new customError(400,"something went wrong while checking exam");
        }
    }
    getAllExams(){
        try{
            return examModel.find({});
        }catch(err){
            throw new customError(400,"something went wrong while checking exam");
        }
    }
    deleteExamById(id){
        try{
            return examModel.findByIdAndDelete(id);
        }catch(err){
            throw new customError(400,"something went wrong while deleting exam");
        }
    }
}