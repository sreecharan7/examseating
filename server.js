import express  from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import ejsLayout from "express-ejs-layouts";
import cookieParser from "cookie-parser";
import path from "path";

import frontend from "./frontend/index.js";
import backend from "./backend/index.js";
import {connect} from "./backend/database/config.js"
import { errorHandler } from "./backend/src/middlewares/error.middleware.js";


const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(ejsLayout);
app.set('view engine','ejs');
app.set('views',path.resolve("frontend","views"));

app.use(express.static("public"));



app.use("/",frontend);
app.use("/api",backend);

app.use(errorHandler);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running on port ",PORT);
  connect();
});