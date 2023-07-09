import multer from "multer";

// const multerUpload = multer();
const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

export { multerUpload };
