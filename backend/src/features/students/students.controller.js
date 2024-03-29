import {StudentRepository} from "./students.repository.js";


export class StudentController {
    constructor(){
        this.studentRepository=new StudentRepository();
    }
    addStudent=async (req,res,next)=>{
        try{
            const {name,roleId,email,branch,year}=req.body;
            const result=await this.studentRepository.addStudent(name,roleId,email,branch,year);
            res.status(200).json(result);
        }catch(err){
            next(err);
        }
    }
}