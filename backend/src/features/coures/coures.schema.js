import mongoose from 'mongoose';

export const courseSchema = new mongoose.Schema({
    courseName: {type: String,required: true},
    courseCode: {type: String,required: true,unique: true},
    teacherId: {type: mongoose.Schema.Types.ObjectId, ref: 'teachers',required: true},
});