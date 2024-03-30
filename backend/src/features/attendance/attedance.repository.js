import mongoose from "mongoose"
import {attendanceSchema} from "./attedance.schema.js"
import {customError} from "../../middlewares/error.middleware.js"

const attedanceModel=mongoose.model("attedanes",attendanceSchema);

export class AttedanceRepository{
    addMultipleAttendances=async(attedances)=>{
        try{
            const bulkOps = attedances.map(update => ({
                updateOne: {
                  filter: { 
                    semesterId: update.semesterId,
                    courseCode: update.courseCode,
                  },
                  update: { 
                    $set: { percentage: update.percentage },
                    },
                  upsert: true  // Create a new document if not found
                }
            }));
            const result = await attedanceModel.bulkWrite(bulkOps);
            return result;

        }catch(err){
            console.log(err);
            throw new customError(400,"something went adding multiple attedances");
        }
    }
    getByCouseIdArray=async (courses)=>{
      try{
        const attendances = await attedanceModel.find({
          courseCode: { $in: courses }
        }).populate("semesterId").populate({
          path: 'semesterId',
          populate: {
            path: 'studentId',
            model: 'students'
          }
        });
        return attendances;
      }catch(err){
        console.log(err);
        throw new customError(400,"something went while fecthing");
      }
    }
}