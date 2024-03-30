import {TeachersRepository} from "./teachers.repository.js";
import {customError} from "../../middlewares/error.middleware.js";
import {CouresRepository} from "../coures/coures.repository.js"
import {ExamPaperRepository} from "../examPaper/examPaper.repository.js";
import {ExamRepository} from "../exams/exams.repository.js"



export class TeachersController{
    constructor(){
        this.repository=new TeachersRepository();
        this.couresRepository=new CouresRepository();
        this.examPaperRepository=new ExamPaperRepository();
        this.examRepository=new ExamRepository();
    }
    async addQuestionPaper(req,res,next){
        try{
            const {couseCode,examId}=req.body;
            let file=req.file;
            if(!file){
                throw new  customError(400,"File not found");
            }
            const course=await this.couresRepository.checkMultipleCourses([couseCode]);
            if(course.length!=1){
                throw new  customError(400,"Course not found");
            }
            const teacherData=await this.repository.getTeacherByuserID(req.userData.cookieData.userId);
            if(!teacherData){
                throw new  customError(400,"Teacher not found");
            }
            if(course[0].teacherId!=teacherData.id){
                throw new  customError(400,"You are not authorized to add question paper to this course");
            }
            const examData=await this.examRepository.checkExamByIdAndCouseCode(examId,couseCode);
            if(!examData){
                throw new  customError(400,"Exam not found");
            }
            await this.examPaperRepository.createExamPaper(examId,couseCode,file.filename);
            res.status(201).json({message:"Question paper added successfully"});
        }catch(err){
            next(err);
        }
    }
}