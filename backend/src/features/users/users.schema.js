import mongoose from "mongoose";
import bcrupt from "bcrypt";

export const userSchema=mongoose.Schema({
    email:{type:"String",required:true,match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,'Please enter a valid email'],index:true,unique:true},
    password:{type:"String",required:true},
    collegeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"college",
        required:true
    },
    role:{type:"String",required:true,enum:["student","admin","teacher"],default:"student"},
    time:{type:"Date",required:true,default:Date.now()},
})

userSchema.pre("save",async function (next){
    if(this.isNew){
        this.password=await bcrupt.hash(this.password,10);
    }
    next();
})