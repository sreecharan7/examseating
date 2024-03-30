import express from "express";
const app=express.Router();
import user  from "./src/features/users/users.router.js"
import student from "./src/features/students/students.router.js";
import admin from "./src/features/admin/admin.router.js";
import teacher from "./src/features/teachers/teachers.router.js"


app.use("/user",user);
// app.use("/student",student);
app.use("/admin",admin);
app.use("/teacher",teacher);

export default app;