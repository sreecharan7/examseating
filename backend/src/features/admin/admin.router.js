import {authorization,checkSpecificRole} from "../../middlewares/authorizer.middleware.js"
import {AdminController} from  "./admin.controller.js"
import upload from "../../middlewares/fileupload.middleware.js"
import express from "express";

const app=express.Router();

const adminController=new AdminController();


app.post("/addStudents",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},
checkSpecificRole,(req,res,next)=>{
    adminController.addStudent(req,res,next);
});

app.post("/addTeachers",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},
checkSpecificRole,(req,res,next)=>{
    adminController.addTeacher(req,res,next);
});

app.post("/addCoures",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},
checkSpecificRole,(req,res,next)=>{
    adminController.addCoures(req,res,next);
});

app.post("/addSemesters",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.addSemester(req,res,next);
});

app.post("/addCouresToStudent",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.addCouresToStudent(req,res,next);
});

app.post("/addstudenstByExel",upload.single('excel'),authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.addStudentsByExel(req,res,next);
});

app.post("/addStudentOne",upload.single('excel'),authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.addStudentOne(req,res,next);
});

app.post("/addClasses",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.addClasses(req,res,next);
});

app.post("/addcourseByExel",upload.single('excel'),authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.addCourseWithRollNoByExel(req,res,next);
});


app.post("/addTeacherByExel",upload.single('excel'),authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.addTeacherByExel(req,res,next);
});

app.post("/addTeacherOne",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.addTeacherOne(req,res,next);
});

app.post("/addExam",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.addExam(req,res,next);
});

app.post("/addAllocateSeat",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.allocateSeat(req,res,next);
});
app.get("/exams",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.getAllExams(req,res,next);
});
app.get("/examsPapers",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.getAllExamPapers(req,res,next);
});

app.delete("/examDelete",authorization,(req,res,next)=>{
    req.data={specificRole:"admin"};
    next();
},checkSpecificRole,(req,res,next)=>{
    adminController.deleteExamById(req,res,next);
});




export default app;