import mongoose from "mongoose";
import {userSchema} from "./users.schema.js"
import { customError } from "../../middlewares/error.middleware.js";
import bcrupt from "bcrypt";


const userModel=mongoose.model("users",userSchema);

export class UserRepository{
    //get from email from database and check psaaword that is bcrupt
    checkEmailPassword=async(email,password)=>{
        try{
            const user=await userModel.findOne({email:email});
            if(!user){
                throw new customError(404,"User not found");
            }
            const isMatch=await bcrupt.compare(password,user.password);
            if(!isMatch){
                throw new customError(400,"Password is not correct");
            }
            return user;
        }catch(err){
            if(err instanceof customError){
                throw err;
            }
            throw new customError(500,"something went wrong while login");
        }
    }
    //add user to database
    addUser=async(email,password,collegeId,role="student")=>{
        try{
            const newUser=new userModel({email,password,collegeId,role});
            const result=await newUser.save();
            return result;
        }catch(err){
            console.log(err);
            throw new customError(500,"something went wrong while adding user");
        }
    }
    addUsersMultiple=async(users)=>{
        try{
            const result=await userModel.insertMany(users);
            return result;
        }catch(err){
            throw new customError(500,"something went wrong while adding user");
        }
    }
    chechEmailArray=async (array)=>{
        try{
            const foundUsers = await userModel.find({ email: { $in: array } });
            return foundUsers;
        }catch(err){
            throw new customError(500,"something went wrong while checking email");
        }
    }
}