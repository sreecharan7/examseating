import multer from "multer";
import path from "path";

const storage=multer.diskStorage({
    destination:function (req,file,cb){
        //dynamic storage
        let ds='data'
        if(req.fileStorageCustom){
            ds=req.fileStorageCustom;
        }
        else if(file.fieldname==="excel"){
            ds=ds+"/excels"
        }
        else{
            ds=ds+"/others"
        }
        cb(null,ds);
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"-"+Date.now()+"-"+path.extname(file.originalname));
    }
});


const upload=multer({storage:storage});

export default upload;