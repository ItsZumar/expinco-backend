import express, { Router } from "express";
import { multerUpload } from "../../../config/multer";
import * as UploadFileWithMulter from "../controller/fileStorage.controller";

const router: Router = express.Router();

router.post("/upload-file", multerUpload.single("file"), UploadFileWithMulter.fileStorage);

export default router;
