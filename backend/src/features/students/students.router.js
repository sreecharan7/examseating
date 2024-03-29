import {StudentController} from "./students.controller.js"
import {authorization} from "../../middlewares/authorizer.middleware.js"
import express from "express";


const app=express.Router();

const studentController=new StudentController();

app.post("/add",authorization,(req,res,next)=>studentController.addStudent(req,res,next));




export default app;