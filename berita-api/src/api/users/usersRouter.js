import express from "express";
import { LoginUsershandler, LogoutUsersHandler, postUserHandler, refreshTokenHandler } from "./usersHandler.js";

const usersRouter = express.Router();
usersRouter.post("/register", postUserHandler);
usersRouter.post("/login", LoginUsershandler);
usersRouter.get("/token", refreshTokenHandler);
usersRouter.delete("/logout", LogoutUsersHandler);

export default usersRouter;
