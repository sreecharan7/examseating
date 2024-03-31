import express from "express"
import {CoursesController} from "./coures.controller.js"
import {authorization,checkSpecificRole} from "../../middlewares/authorizer.middleware.js";


const app=express.Router();
const coursesController=new CoursesController();

app.get("/getCourses",authorization,
(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},
checkSpecificRole,
(req,res,next)=>coursesController.getCouseByTeacherId(req,res,next));



export default app;