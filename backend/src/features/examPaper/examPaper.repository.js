import mongoose from "mongoose";
import {examPaperSchema} from "./examPaper.schema.js";
import {customError} from "../../middlewares/error.middleware.js"


const ExamPaper = mongoose.model("ExamPaper", examPaperSchema);

export  class ExamPaperRepository {
    async createExamPaper(examId,couseCode,paper,key,iv,fileName) {
        try{
            const updatedExamPaper = await ExamPaper.findOneAndUpdate(
                { 
                    examId: examId,
                    couseCode: couseCode
                }, // Search criteria
                { paper: paper,
                    iv:iv,
                    key:key,
                    fileName:fileName
                },    // Update to apply
                { 
                  new: true,            // Return the modified document (default is original)
                  upsert: true          // Create a new document if no match found
                }
              );
              return updatedExamPaper;
        }catch(err){
            console.log(err);
            throw new  customError(400,"something went wrong while adding ExamPaper");
        }
    }
    async getAllExamPapers(){
        try{
            return await ExamPaper.find();
        }catch(err){
            throw new  customError(400,"something went wrong while fetching ExamPaper");
        }
    }
    async getPapersById(examId){
        try{
            return await ExamPaper.find({examId});
        }catch(err){
            throw new  customError(400,"something went wrong while fetching ExamPaper");
        }
    }
}