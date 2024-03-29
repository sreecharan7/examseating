import express from "express";
const app=express.Router();
import user  from "./src/features/users/users.router.js"
import student from "./src/features/students/students.router.js";
import admin from "./src/features/admin/admin.router.js";


app.use("/user",user);
// app.use("/student",student);
app.use("/admin",admin);

export default app;