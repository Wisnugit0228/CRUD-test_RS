import express, { json } from "express";
import dotenv from "dotenv";
import newsRouter from "./api/news/routesNews.js";
import cors from "cors";
import usersRouter from "./api/users/usersRouter.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "*" }));
app.use(cookieParser());
app.use(express.static("uploads"));

app.use(newsRouter);
app.use(usersRouter);

app.listen(3000, () => console.log(`server running on port 3000`));
