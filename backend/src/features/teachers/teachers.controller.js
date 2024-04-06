import {TeachersRepository} from "./teachers.repository.js";
import {customError} from "../../middlewares/error.middleware.js";
import {CouresRepository} from "../coures/coures.repository.js"
import {ExamPaperRepository} from "../examPaper/examPaper.repository.js";
import {ExamRepository} from "../exams/exams.repository.js"
import crypto  from'crypto';
import fs  from'fs';
import {createCipheriv,randomFill,scrypt} from "crypto"
import { pipeline } from "stream"
import { createReadStream,createWriteStream } from "fs"

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
            let eccData=encryptFile(`./${req.file.destination}/${req.file.filename}`,`./public/papers/${req.file.filename}.enc`);
            eccData.key=eccData.key.toString('hex');
            eccData.iv=eccData.iv.toString('hex');
            await this.examPaperRepository.createExamPaper(examId,couseCode,`${req.file.filename}.enc`,eccData.key,eccData.iv);
            res.status(201).json({message:"Question paper added successfully"});
        }catch(err){
            next(err);
        }
    }
    getAllTeachers=async(req,res,next)=>{
        try{
            const teachers=await this.repository.getAllTeachers();
            res.send({data:teachers});
        }catch(err){
            next(err);
        }
    }
}

function encryptFile(inputFile,outputFile){
    const algorithm = 'aes-192-cbc';
    const key = generateKey();
    const iv = generateIV();
    encrypt(inputFile,outputFile,key,iv,algorithm)
    return {
        key:key,
        iv:iv
    }
}



const generateKey = () => {
    return crypto.randomBytes(24);
};
  
const generateIV = () => {
    return crypto.randomBytes(16);
};
  
const encrypt = (inputFile, outputFile, key, iv,algorithm) => {
    const readStream = fs.createReadStream(inputFile);
    const writeStream = fs.createWriteStream(outputFile);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
  
    readStream.pipe(cipher).pipe(writeStream);
  
    writeStream.on('finish', () => {
        deleteFile(inputFile);
    });
};

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        return;
      }
    });
  };