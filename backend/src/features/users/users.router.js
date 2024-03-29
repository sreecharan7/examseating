import express from "express";
const app=express.Router();
import  {UserController} from "./users.controller.js"

const userController=new UserController();


app.post("/login",(req,res,next)=>userController.login(req,res,next));
app.post("/register",(req,res,next)=>userController.register(req,res,next));


export default app;