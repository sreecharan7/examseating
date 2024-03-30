import express from "express"
import { viewController } from "./view.controller.js";


const app=express.Router();

const  viewC=new viewController();

app.get("/",viewC.home);
app.get("/login",viewC.login);
app.get("/terms-and-conditions",viewC.termsAndConditions);
app.get("/v/admin",viewC.adminHome);

export default app;