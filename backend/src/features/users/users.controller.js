import {UserRepository} from "./users.repository.js"
import { customError } from "../../middlewares/error.middleware.js";
import {createCookie} from "../../middlewares/authorizer.middleware.js";


export class UserController{
    constructor(){
        this.userrepository=new UserRepository();
    }
    //login
    login=async(req,res,next)=>{
        try{
            const {email,password}=req.body;
            if(!email || !password){
                throw new customError(400,"Email and password is required");
            }
            const result=await this.userrepository.checkEmailPassword(email,password);
            if(result){
                req.userData={};
                req.userData.cookieData={userId:result._id,role:result.role,collegeId:result.collegeId};
                await createCookie(req,res,next);
                res.status(200).json({message:"Login success"});
            }else{
                throw new customError(400,"Login failed");
            }
        }catch(err){
            next(err);
        }
    }
    //register
    register=async(req,res,next)=>{
        try{
            const {email,password}=req.body;
            if(!email || !password){
                throw new customError(400,"Email and password is required");
            }
            const result=await this.userrepository.addUser(email,password);
            res.status(200).json({message:"User added successfully"});
        }catch(err){
            next(err);
        }
    }
}