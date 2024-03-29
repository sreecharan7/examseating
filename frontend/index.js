import express from "express";
import paths from "./src/view.router.js";
const app=express.Router();

app.use("/",paths);

export default app;