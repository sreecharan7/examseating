import {StudentRepository} from "../students/students.repository.js"
import {UserRepository} from "../users/users.repository.js"
import {TeachersRepository} from "../teachers/teachers.repository.js"
import {customError} from "../../middlewares/error.middleware.js"
import {CouresRepository} from "../coures/coures.repository.js"
import {SemesterRepositroy} from "../semesters/semesters.repository.js"
import {AttedanceRepository} from "../attendance/attedance.repository.js"
import {classesRepositroy} from "../classes/classes.repository.js"

import xlsx from 'xlsx';


const isValidObjectId = (id) => {
    if(id instanceof Object){
        return false;
    }
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;  
    return objectIdPattern.test(id);
};

export class AdminController{
    constructor(){
        this.studentRepository=new StudentRepository();
        this.userRepository=new UserRepository();
        this.teacherRepository=new TeachersRepository();
        this.couresRepository=new CouresRepository();
        this.semesterRepositroy=new SemesterRepositroy();
        this.attedanceRepository=new AttedanceRepository();
        this.classesRepositroy=new classesRepositroy();
    }
    //add student
    addStudent=async(req,res,next)=>{
        try{
            const {data}=req.body;
            let defaultpassword=req.body["defaultpassword"];
            if(!defaultpassword){defaultpassword="123456";}
            //check array
            if(!data||typeof(data)!="object"){
                throw new customError(400,"data is required");
            }
            //validation
            if(!data.length||data.length==0){
                throw new customError(400,"data is required");
            }
            for(let i=0;i<data.length;i++){
                if(data[i]["name"]&&data[i]["email"]&&data[i]["branch"]&&data[i]["year"]&&data[i]["rollNo"]){
                }else{
                    throw new customError(400,"error at data at "+i);
                }
            }
            //check emails exist in data repeat
            let email={};
            for(let i=0;i<data.length;i++){
                if(email[data[i]["email"]]){
                    throw new customError(400,"email already exist in data repeat"+data[i]["email"]);
                }
                email[data[i]["email"]]=true;
            }

            //make array of emails
            let emails=Object.keys(email);;            
            //check email in database
            const foundUsers = await this.userRepository.chechEmailArray(emails);
            if(foundUsers.length>0){
                throw new customError(400,"email already exist");
            }
            //add students
            let UserData=[];
            for(let i=0;i<data.length;i++){
                UserData.push({
                    email:data[i]["email"],
                    password:defaultpassword,
                    collegeId:req.userData.cookieData.collegeId,
                    role:"student"
                });
            }
            let users=await this.userRepository.addUsersMultiple(UserData);
            let studentData=[];
            for(let i=0;i<data.length;i++){
                studentData.push({
                    name:data[i]["name"],
                    email:data[i]["email"],
                    rollNo:data[i]["rollNo"],
                    branch:data[i]["branch"],
                    year:data[i]["year"],
                    userId:users[i]._id
                });
            }
            let students=await this.studentRepository.addStudentsMultiple(studentData);
            if(!req.nores){
                res.status(200).json({message:"students added successfully"});
            }else{
                return students;
            }
        }
        catch(err){
            if(!req.nores){
                next(err);
            }else{
                return err;
            }
        }
    }
    //add teacher
    addTeacher=async(req,res,next)=>{
        try{
            const {data}=req.body;
            let defaultpassword=req.body["defaultpassword"];
            if(!defaultpassword){defaultpassword="123456";}
            //check array
            if(!data||typeof(data)!="object"){
                throw new customError(400,"data is required");
            }
            //validation
            if(!data.length||data.length==0){
                throw new customError(400,"data is required");
            }
            for(let i=0;i<data.length;i++){
                if(data[i]["name"]&&data[i]["email"]&&data[i]["about"]){
                }else{
                    throw new customError(400,"error at data at "+i);
                }
            }
            //check emails exist in data repeat
            let email={};
            for(let i=0;i<data.length;i++){
                if(email[data[i]["email"]]){
                    throw new customError(400,"email already exist in data repeat"+data[i]["email"]);
                }
                email[data[i]["email"]]=true;
            }
            //make array of emails
            let emails=Object.keys(email);
            //check email in database
            const foundUsers = await this.userRepository.chechEmailArray(emails);
            if(foundUsers.length>0){
                throw new customError(400,"email already existf");
            }
            //add users
            let UserData=[];
            for(let i=0;i<data.length;i++){
                UserData.push({
                    email:data[i]["email"],
                    password:defaultpassword,
                    collegeId:req.userData.cookieData.collegeId,
                    role:"teacher"
                });
            }
            let users=await this.userRepository.addUsersMultiple(UserData);
            let teacherData=[];
            for(let i=0;i<data.length;i++){
                teacherData.push({
                    name:data[i]["name"],
                    email:data[i]["email"],
                    about:data[i]["about"],
                    userId:users[i]._id
                });
            }
            let teachers=await this.teacherRepository.addMultipleTeachers(teacherData);
            res.status(200).json({message:"teachers added successfully"});
        }
        catch(err){
            next(err);
        }
    }
    //add coures
    addCoures=async(req,res,next)=>{
        try{
            const {data}=req.body;
            let defaultpassword=req.body["defaultpassword"];
            if(!defaultpassword){defaultpassword="123456";}
            //check array validation
            if(!data||typeof(data)!="object"||!data.length||data.length==0){
                throw new customError(400,"data is required");
            }
            let courses=[];
            let teacherIds=[];
            for(let i=0;i<data.length;i++){
                if(data[i]["courseName"]&&data[i]["courseCode"]&&data[i]["teacherId"]&&isValidObjectId(data[i]["teacherId"])){
                    courses.push({
                        courseName:data[i]["courseName"],
                        courseCode:data[i]["courseCode"],
                        teacherId:data[i]["teacherId"],
                    });
                    teacherIds.push(data[i]["teacherId"]);
                }else{
                    throw new customError(400,"error at data at "+i);
                }
            }
            //check teacher exist or no5t with their id
            let teacherCheck=await this.teacherRepository.checkTeacherArray(teacherIds);
            if(teacherCheck.length!=teacherIds.length){
                throw new customError(400,"teacher not found");
            }
            let coures = await this.couresRepository.addMultipleCourses(courses);
            res.status(200).json({message:"coures added successfully"});

        }catch(err){
            next(err);
        }
    }
    //add semester to student
    addSemester=async(req,res,next)=>{
        try{
        let {data}=req.body;
        if(!data||typeof(data)!="object"||!data.length||data.length==0){
            throw new customError(400,"data is required");
        }
        let startDate=req.body["startDate"];
        let endDate=req.body["endDate"];
        if(!startDate||!endDate){
            throw new customError(400,"startDate and endDate is required");
        }
        let studentIds=[];
        let semester=[];
        for(let i=0;i<data.length;i++){
            if(data[i]["studentId"]&&data[i]["name"]&&data[i]["isCurrent"]){
                studentIds.push(data[i]["studentId"]);
                semester.push({
                    name:data[i]["name"],
                    startDate:startDate,
                    endDate:endDate,
                    isCurrent:data[i]["isCurrent"],
                    studentId:data[i]["studentId"],
                    payment:data[i]["payment"]
                });
                
            }else{
                throw new customError(400,"error at data at "+i);
            }
        }
        //check students ID
        let studentCheck=await this.studentRepository.checkStudentArray(studentIds);
        if(studentCheck.length!=data.length){
            throw new customError(400,"student not found");
        }
        let semestersAdd=await this.semesterRepositroy.addMultipleSemesters(semester);
        if(!req.nores){
            res.status(200).json({message:"semesters added successfully"});
        }else{
            return semestersAdd;
        }

    }catch(err){
        if(!req.nores){
            next(err);
        }else{
            return err;
        }
    }
    }
    addCouresToStudent=async (req,res,next)=>{
        try{
            let {data}=req.body;
            if(!data||typeof(data)!="object"||!data.length||data.length==0){
                throw new customError(400,"data is required");
            }
            let semesterName=req.body["semesterName"];
            if(!semesterName){
                throw new customError(400,"data is required as semesterName");
            }
            let semestersData=[];
            let attedancelist=[];
            let courseCodesMap={};
            for(let i=0;i<data.length;i++){
                if(data[i]["studentId"]&&data[i]["courseName"]){
                    semestersData.push({studentId:data[i]["studentId"],name:semesterName});
                    attedancelist.push({
                        courseCode:data[i]["courseName"],
                        percentage:data[i]["percentage"]
                    });
                    courseCodesMap[data[i]["courseName"]]=1;
                }else{
                    throw new customError(400,"error at data at "+i);
                }
            }
            let semesterCheck=await this.semesterRepositroy.checkMultipleWithNameAndStudentId(semestersData);
            if(semesterCheck.length!=data.length){
                throw new customError(400,"semester not found");
            }
            let couresCheck=await this.couresRepository.checkMultipleCourses(Object.keys(courseCodesMap));
            if(couresCheck.length!=Object.keys(courseCodesMap).length){
                throw new customError(400,"coures not found");
            }
            console.log(attedancelist,semesterCheck,data);
            for(let i=0;i<data.length;i++){
                attedancelist[i]["semesterId"]=semesterCheck[i]._id;
            }
            let attedance=await this.attedanceRepository.addMultipleAttendances(attedancelist);
            if(!req.nores){
                res.status(200).json({message:"coures added successfully"});
            }else{
                return attedance;
            }
        }catch(err){
            if(!req.nores){
                next(err);
            }else{
                return err;
            }
        }
    }
    addStudentsByExel=async (req,res,next)=>{
        try{
            //read file address
            if(!req.file){
                throw new customError(400,"file is required");
            }
            let fileAddress=req.file.path;
            let {startDate,endDate,defaultpassword,semesterName} =req.body;
            if(!startDate||!endDate||!semesterName){
                throw new customError(400,"startDate , endDate ,semseterName is required");
            }
            //read file
            const workbook = xlsx.readFile(fileAddress);
            const sheet_name = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[sheet_name];
            const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
            req.nores=true;
            //convert the data to the required format
            let students=[];
            for(let i=0;i<data.length;i++){
                if(i==0){
                    continue;
                }
                students.push({
                    name:data[i][0],
                    rollNo:data[i][1],
                    email:data[i][2],
                    branch:data[i][3],
                    year:data[i][4]
                });
            }
            req.body={data:students,defaultpassword};
            const studentsData =await this.addStudent(req,res,next);
            if(studentsData instanceof Error){
                throw studentsData;
            }
            students=[];
            for(let i=0;i<studentsData.length;i++){
                students.push({
                    name:semesterName,
                    studentId:studentsData[i]._id,
                    isCurrent:true,
                    payment:data[i+1][5]
                });
            }
            req.body={data:students,startDate,endDate};
            const semestersData =await this.addSemester(req,res,next);
            if(semestersData instanceof Error){
                throw semestersData;
            }
            res.status(200).json({message:"students added successfully"});
        }catch(err){
            next(err);
        }
    }
    addClasses=async (req,res,next)=>{
        try {
            const {data}=req.body;
            if(!data||typeof(data)!="object"||!data.length||data.length==0){
                throw new customError(400,"data is required");
            }
            let classes=[];
            for(let i=0;i<data.length;i++){
                if(data[i]["sturcture"]&&data[i]["name"]&&data[i]["noOfTeacherRequired"]){
                    classes.push({
                        structure:data[i]["sturcture"],
                        name:data[i]["name"],
                        noOfTeacherRequired:data[i]["noOfTeacherRequired"] 
                    });
                }else{
                    throw new customError(400,"error at data at "+i);
                }
            }
            let classesAdd=await this.classesRepositroy.addMultipleClasses(classes);
            res.status(200).json({message:"classes added successfully"});
        } catch (error) {
           next(error); 
        }
    }
    addCourseWithRollNoByExel=async (req,res,next)=>{
        try{
            //read file address
            if(!req.file){
                throw new customError(400,"file is required");
            }
            let fileAddress=req.file.path;
            let {semesterName} =req.body;
            if(!semesterName){
                throw new customError(400,"semesterName is required");
            }
            //read file
            const workbook = xlsx.readFile(fileAddress);
            const sheet_name = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[sheet_name];
            const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
            req.nores=true;
            //convert the data[i][0] from roolno to studentId
            let students=[];
            let rollNo=[];
            for(let i=0;i<data.length;i++){
                if(i==0){
                    continue;
                }
                rollNo.push(data[i][0]);
            }
            let studentCheck=await this.studentRepository.checkStudentArray(rollNo,"rollNo");
            if(studentCheck.length!=rollNo.length){
                throw new customError(400,"student not found");
            }
            let map={};
            for(let i=0;i<studentCheck.length;i++){
                map[studentCheck[i].rollNo]=studentCheck[i]._id;
            }
            for(let i=0;i<data.length;i++){
                if(i==0){
                    continue;
                }
                students.push({
                    studentId:map[data[i][0]],
                    courseName:data[i][1],
                    percentage:data[i][2]
                });
            }
            req.body={data:students,semesterName};
            const attedanceData =await this.addCouresToStudent(req,res,next);
            if(attedanceData instanceof Error){
                throw attedanceData;
            }
            res.status(200).json({message:"coureses added successfully"});
        }catch(err){
            next(err);
        }
    }

}
