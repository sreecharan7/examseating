import {CouresRepository} from "./coures.repository.js"

export class CoursesController{
    constructor(){
        this.coursesRepository=new CouresRepository();
    }
    getCouseByTeacherId=async (req,res,next)=>{
        try{
            const {teacherId}=req.query;
            const teachers=await this.coursesRepository.getCouseByTeacherId(teacherId);
            res.send({data:teachers});
        }catch(err){
            next(err);
        }
    }
}