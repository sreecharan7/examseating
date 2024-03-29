import jwt from "jsonwebtoken";
import { customError } from "./error.middleware.js";
import dotenv from "dotenv";


dotenv.config();

export async function authorization(req,res,next){
    try{
        let token =req.cookies[process.env.cookieNameUserCredientails];
        if(token){
        let data=await jwt.verify(token,process.env.jwt);
        if(data.userId){
            req.userData={};
            req.userData.cookieData=data;
            next();
        }else{
            res.cookie(process.env.cookieNameUserCredientails,'',{expires:new Date(0)});
            throw new customError(400,"data is missing in cookie")
        }
        }
        else{
            throw new customError(400,"cookie is not there")
        }
    }
    catch(err){
        next(err);
    }
}

export async function createCookie(req,res,next){
    try{
        let token=await jwt.sign(req.userData.cookieData,process.env.jwt);
        res.cookie(process.env.cookieNameUserCredientails,token,{maxAge: parseInt(process.env.expoireOfCookieUserCredientails)});
        next();
    }
    catch(err){
        throw new customError(500,"error in creating cookie");
    }
}

export async function checkSpecificRole(req,res,next){
    try{
        //req.data.specificRole
        if(req.userData.cookieData.role===req.data.specificRole){
            next();
        }
        else{
            throw new customError(400,"you are not authorized to access this role");   
        }
    }
    catch(err){
        if(err instanceof customError){
            next(err);
        }else{
            throw new customError(500,"error while authourization")
        }
    }
}