import mongoose from "mongoose";
import {examPaperSchema} from "./examPaper.schema.js";
import {customError} from "../../middlewares/error.middleware.js"


const ExamPaper = mongoose.model("ExamPaper", examPaperSchema);

export  class ExamPaperRepository {
    async createExamPaper(examId,couseCode,paper) {
        try{
            return await ExamPaper.create({examId,couseCode,paper});
        }catch(err){
            throw new  customError(400,"something went wrong while adding ExamPaper");
        }
    }
}