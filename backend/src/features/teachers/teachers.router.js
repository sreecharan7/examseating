import express from 'express';
import {TeachersController} from "./teachers.controller.js";
import upload from "../../middlewares/fileupload.middleware.js";
import {authorization,checkSpecificRole} from "../../middlewares/authorizer.middleware.js";

const app=express.Router();

const teacherController=new TeachersController();

app.post("/addQuestionPaper",authorization,
(req,res,next)=>{
    req.data={specificRole:"teacher"};
    next();
},
checkSpecificRole,
upload.single("questionPaper"),(req,res,next)=>teacherController.addQuestionPaper(req,res,next));


export default app;