
export class viewController{
    home=async (req,res,next)=>{
        try{
            await res.render("home",{title:"Home",javascript:null,css:``});
        }
        catch(err){
            next(err);
        }
    }
    login=async (req,res,next)=>{
        try{
           await res.render("login",{title:"Login",javascript:`<script type="text/javascript" src="/javascript/login.js" ></script>`});
        }
        catch(err){
            next(err);
        }
    }
    termsAndConditions=async (req,res,next)=>{
        try{
            await res.render("termsAndConditions",{title:"Terms and Conditions",javascript:null});
        }
        catch(err){
            next(err);
        }
    }
    adminHome=async (req,res,next)=>{
        try{
            await res.render("adminHome",{title:"Admin Home",javascript:`<script type="text/javascript" src="/javascript/adminHome.js" ></script>`});
        }
        catch(err){
            next(err);
        }
    }
    examsData=async (req,res,next)=>{
        try{
            await res.render("examsData",{title:"Exams Data",javascript:`<script type="text/javascript" src="/javascript/examsData.js" ></script>`});
        }
        catch(err){
            next(err);
        }
    }
    teacherHome=async (req,res,next)=>{
        try{
            await res.render("teachersHome",{title:"Teacher Home",javascript:`<script type="text/javascript" src="/javascript/teacherHome.js" ></script>`});
        }
        catch(err){
            next(err);
        }
    }
}