import {StudentRepository} from "../students/students.repository.js"
import {UserRepository} from "../users/users.repository.js"
import {TeachersRepository} from "../teachers/teachers.repository.js"
import {customError} from "../../middlewares/error.middleware.js"
import {CouresRepository} from "../coures/coures.repository.js"
import {SemesterRepositroy} from "../semesters/semesters.repository.js"
import {AttedanceRepository} from "../attendance/attedance.repository.js"
import {classesRepositroy} from "../classes/classes.repository.js"
import {ExamRepository} from "../exams/exams.repository.js"
import {gets_seating} from "../../../algorithm/as.js"
import {ExamPaperRepository} from "../examPaper/examPaper.repository.js"

import xlsx from 'xlsx';
import path from 'path';

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
        this.examRepository=new ExamRepository();
        this.examPaperRepository=new ExamPaperRepository();
    }
    //add student
    addStudent=async(req,res,next)=>{
        try{
            const {data}=req.body;
            let defaultpassword=req.body["defaultpassword"];
            if(!defaultpassword){defaultpassword=process.env.defaultpassword;}
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
    addStudentOne=async(req,res,next)=>{
        try{
            let {name,email,rollNo,branch,year} =req.body;
            // console.log(req.body);
            if(!name||!email||!rollNo||!branch||!year){
                throw new customError(400,"name,email,rollNo,branch,year is required");
            }
            let {startDate,endDate,password,semesterName} =req.body;
            if(!startDate||!endDate||!semesterName){
                throw new customError(400,"startDate , endDate ,semseterName is required");
            }
            req.body["data"]=[{name,email,rollNo,branch,year}];
            req.body["defaultpassword"]=password||process.env.defaultpassword;
            req.nores=true;
            const studentData =await this.addStudent(req,res,next);
            if(studentData instanceof Error){
                throw studentData;
            }
            let students=[];
            for(let i=0;i<studentData.length;i++){
                students.push({
                    name:semesterName,
                    studentId:studentData[i]._id,
                    isCurrent:true,
                    payment:req.body["payment"]
                });
            }
            req.body={data:students,startDate,endDate};
            const semestersData =await this.addSemester(req,res,next);
            if(semestersData instanceof Error){
                throw semestersData;
            }
            res.status(200).json({message:"student added successfully"});
        }catch(err){
            next(err);
        }
    }
    //add teacher
    addTeacher=async(req,res,next)=>{
        try{
            const {data}=req.body;
            let defaultpassword=req.body["defaultpassword"];
            if(!defaultpassword){defaultpassword=process.env.defaultpassword;}
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
            if(!req.nores){
                res.status(200).json({message:"teachers added successfully"});
            }
            else{
                return true;
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
    addTeacherOne=async(req,res,next)=>{
        try{
            let {name,email,about,password}=req.body;
            // console.log(req.body);
            if(!name||!email||!about){
                throw new customError(400,"name,email,about is required");
            }
            let defaultpassword=password||process.env.defaultpassword;
            req.body["data"]=[{name,email,about}];
            req.body["defaultpassword"]=defaultpassword;
            req.nores=true;
            const teacherData =await this.addTeacher(req,res,next);
            if(teacherData instanceof Error){
                throw teacherData;
            }
            res.status(200).json({message:"teacher added successfully"});

        }catch(err){
            next(err);
        }
    }
    addTeacherByExel=async(req,res,next)=>{
        try{
        if(!req.file){
            throw new customError(400,"file is required");
        }
        let fileAddress=req.file.path;
        const workbook = xlsx.readFile(fileAddress);
        const sheet_name = workbook.SheetNames[0]; 
        const worksheet = workbook.Sheets[sheet_name];
        const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        req.nores=true;
        let teachers=[];
        for(let i=1;i<data.length;i++){
            teachers.push({
                name:data[i][0],
                email:data[i][1],
                about:data[i][2]
            });
        }
        req.body={data:teachers};
        const teacherData =await this.addTeacher(req,res,next);
        if(teacherData instanceof Error){
            throw teacherData;
        }
        res.status(200).json({message:"teachers added successfully"});
    }
    catch(err){
        next(err);
    }
    }
    //add coures
    addCoures=async(req,res,next)=>{
        try{
            const data1=req.body;

            if(!data1||!data1["courseCode"]||!data1["courseName"]||!data1["teacherId"]){
                throw new customError(400,"data is required");
            }
            let data=[]
            data.push(data1);
            //check array validation
            let teacherIds=[];
            teacherIds.push(data1["teacherId"]);
            //check teacher exist or no5t with their id
            let teacherCheck=await this.teacherRepository.checkTeacherArray(teacherIds);
            if(teacherCheck.length!=teacherIds.length){
                throw new customError(400,"teacher not found");
            }
            let coures = await this.couresRepository.addCoures(data1["courseName"],data1["courseCode"],data1["teacherId"]);
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
            let map={};
            for(let i=0;i<data.length;i++){
                map[semesterCheck[i]["studentId"]]=semesterCheck[i]._id;
            }
            for(let i=0;i<data.length;i++){
                attedancelist.push({
                    semesterId:map[data[i]["studentId"]],
                    courseCode:data[i]["courseName"],
                    percentage:data[i]["percentage"]
                });
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
            if(!defaultpassword){
                defaultpassword=process.env.defaultPasswordUser;
            }
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
                    password:defaultpassword,
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
            const data1=req.body;
            let data=[];
            data.push(data1);
            if(!data||typeof(data)!="object"||!data.length||data.length==0){
                throw new customError(400,"data is required");
            }
            let classes=[];
            for(let i=0;i<data.length;i++){
                if(data[i]["structure"]&&data[i]["name"]&&data[i]["noOfTeacherRequired"]&&data[i]["structure"].trim()!=""){
                    let structureArray=data[i]["structure"].split(",");
                        let structureClassArray=[];
                    for(let i=0;i<structureArray.length; i++){
                        let structureClass=structureArray[i].split(" ");

                        for(let i=0; i<structureClass. length; i++){
                            if(structureClass[i] == "") {
                                structureClass.splice(i,1);
                            }
                        }
                        structureClassArray.push(structureClass);
                    }
                    data[i]["structure"]=structureClassArray;
                    classes.push({
                        structure:data[i]["structure"],
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
    addExam=async (req,res,next)=>{
        try {
            let {name,classes,courses,examDate,startTime}=req.body;
            console.log(req.body);
            if(!name||!classes||classes.length==0||!examDate||!startTime||!courses||courses.length==0){
                throw new customError(400,"name,classes,courses,examDate,startTime is required");
            }
            let classesArray=courses.split(",");
            courses=classesArray;
            console.log(courses);
            let classesArray1=classes.split(",");
            classes=classesArray1;
            //check coures exist or not in database
            let map={};
            for(let i=0;i<courses.length;i++){
                map[courses[i]]=1;
            }
            let couresCheck=await this.couresRepository.checkMultipleCourses(Object.keys(map));
            if(courses.length!=couresCheck.length){
                throw new customError(400,"course not found");
            }
            let classesChecker=await this.classesRepositroy.checkMultipleClasses(classes);
            if(classesChecker.length!=classes.length){
                throw new customError(400,"classes not found");
            }
            let exam=await this.examRepository.addExam(name,classes,courses,examDate,startTime);
            req.nores=true;
            req.body={examId:exam._id};
            let allocate=await this.allocateSeat(req,res,next);
            console.log(allocate);
            if(allocate instanceof Error||!allocate){
                await this.examRepository.deleteExamById(exam._id);
                return;
            }
            res.status(200).json({message:"exam added successfully"});
        } catch (err) {
            next(err);
        }
    }
    allocateSeat=async (req,res,next)=>{
        try{
            const {examId}=req.body;
            if(!examId){
                throw new customError(400,"give input examId");
            }
            let examData=await this.examRepository.getExamById(examId);
            if(!examData){
                throw new customError(400,"wrong exam id");
            }
            //exact data from attedance using couresId
            let semesterStudents=await this.attedanceRepository.getByCouseIdArray(examData["courses"]);
            let students=[];
            let notAllowedStudents=[];
            let map={};
            for(let i=0;i<semesterStudents.length;i++){
                if(semesterStudents[i]["percentage"]>75&&semesterStudents[i]["semesterId"]["payment"]){
                    students.push({
                        rollNo:semesterStudents[i]["semesterId"]["studentId"]["rollNo"],
                        branch:semesterStudents[i]["semesterId"]["studentId"]["branch"],
                        year:semesterStudents[i]["semesterId"]["studentId"]["year"],
                        course:semesterStudents[i]["courseCode"],
                        students:[semesterStudents[i]["semesterId"]["studentId"]["rollNo"]]
                    });
                }
                else{
                    notAllowedStudents.push({
                        rollNo:semesterStudents[i]["semesterId"]["studentId"]["rollNo"],
                        branch:semesterStudents[i]["semesterId"]["studentId"]["branch"],
                        year:semesterStudents[i]["semesterId"]["studentId"]["year"],
                        course:semesterStudents[i]["courseCode"],
                        students:[semesterStudents[i]["semesterId"]["studentId"]["rollNo"]]
                    });
                }
                map[semesterStudents[i]["semesterId"]["studentId"]["rollNo"]]={
                    branch:semesterStudents[i]["semesterId"]["studentId"]["branch"],
                    year:semesterStudents[i]["semesterId"]["studentId"]["year"],
                    course:semesterStudents[i]["courseCode"],
                    name:semesterStudents[i]["semesterId"]["studentId"]["name"]
                };
            }
            let classesChecker=await this.classesRepositroy.checkMultipleClasses(examData["classes"]);

            let sendData={
                students:students,
                classes:classesChecker
            }
            let seating=gets_seating(sendData,"course");
            if(seating["error"]){
                throw new customError(400,seating["msg"]);
            }
            let data = [];
            let workbook = xlsx.utils.book_new();
            for(let i=0;i<seating["classes_data"].length;i++){
                data.push([seating["classes_data"][i]["name"]]);
                for(let j=0;j<seating["classes_data"][i]["seating"].length;j++){
                    data.push(seating["classes_data"][i]["seating"][j]);
                }
                
                const worksheet = xlsx.utils.aoa_to_sheet(data);
                xlsx.utils.book_append_sheet(workbook, worksheet, `${seating["classes_data"][i]["name"]}`);
                data=[];
            }
            
            let filePath = path.join( `./public/excels/${examId}.xlsx`);

            xlsx.writeFile(workbook, filePath);

            workbook=xlsx.utils.book_new();

            data=[];
            data.push(["roll no","branch","year","course","students"]);
            for(let i=0;i<notAllowedStudents.length;i++){
                data.push([notAllowedStudents[i]["rollNo"],notAllowedStudents[i]["branch"],notAllowedStudents[i]["year"],notAllowedStudents[i]["course"],notAllowedStudents[i]["students"]]);
            }
            const worksheet = xlsx.utils.aoa_to_sheet(data);
            xlsx.utils.book_append_sheet(workbook, worksheet, `notAllowedStudents`);

            let filePath1 = path.join( `./public/excels/${examId}-notAllowedStudents.xlsx`);
            xlsx.writeFile(workbook, filePath1);
            
            workbook=xlsx.utils.book_new();
            data=[];
            //class room data
            for(let i=0;i<seating["classes_data"].length;i++){
                let classData=[];
                let classStudent=[];
                for(let j=1;j<seating["classes_data"][i]["seating"].length;j++){
                    for(let k=0;k<seating["classes_data"][i]["seating"][j].length;k++){
                        if(seating["classes_data"][i]["seating"][j][k]!="-"&&seating["classes_data"][i]["seating"][j][k]!="0"){
                            classStudent.push(seating["classes_data"][i]["seating"][j][k]);
                        }
                    }
                }
                classStudent.sort();
                classData.push(["roll no","name","branch","year","course","Booklet Code","Signature"]);
                for(let j=0;j<classStudent.length;j++){
                    classData.push([classStudent[j],map[classStudent[j]]["name"],map[classStudent[j]]["branch"],map[classStudent[j]]["year"],map[classStudent[j]]["course"]]);
                }
                const worksheet = xlsx.utils.aoa_to_sheet(classData);
                xlsx.utils.book_append_sheet(workbook, worksheet, `${seating["classes_data"][i]["name"]}`);
            }
            let filePath2 = path.join( `./public/excels/${examId}-classRoomData.xlsx`);
            xlsx.writeFile(workbook, filePath2);
            if(!req.nores){
                res.status(200).json({msg:"allocated sucessfuly"});
            }else{
                return {msg:"allocated sucessfuly"};
            }
        }catch(err){
            next(err);
        }
    }
    getAllExams=async (req,res,next)=>{
        try{
            let exams=await this.examRepository.getAllExams();
            res.status(200).json({exams});
        }catch(err){
            next(err);
        }
    }
    getAllExamPapers=async (req,res,next)=>{
        try{
            console.log(req.query);
            if(!req.query||!req.query.examId||!isValidObjectId(req.query.examId)){
                throw new customError(400,"examId is required");
            }
            let examPapers=await this.examPaperRepository.getPapersById(req.query.examId);
            res.status(200).json({examPapers});
        }catch(err){
            next(err);
        }
    }
    deleteExamById=async (req,res,next)=>{
        try{
            if(!req.query||!req.query.examId||!isValidObjectId(req.query.examId)){
                throw new customError(400,"examId is required");
            }
            let exam=await this.examRepository.deleteExamById(req.query.examId);
            res.status(200).json({message:"exam deleted successfully"});
        }catch(err){
            next(err);
        }
    }
}
