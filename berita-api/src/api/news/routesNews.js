import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { deleteNewsByIdHandler, gateNewsHandler, getNewsByIdHandler, postNewsHandler, putNewsByIdHandler } from "./handlerNew.js";
import multer from "multer";
import storage from "../../middleware/uploadFile.js";

const upload = multer({ storage: storage });

const newsRouter = express.Router();
newsRouter.post("/news", verifyToken, upload.single("image"), postNewsHandler);
newsRouter.get("/news", verifyToken, gateNewsHandler);
newsRouter.get("/news/:id", verifyToken, getNewsByIdHandler);
newsRouter.put("/news/:id", verifyToken, upload.single("image"), putNewsByIdHandler);
newsRouter.delete("/news/:id", verifyToken, deleteNewsByIdHandler);

export default newsRouter;
