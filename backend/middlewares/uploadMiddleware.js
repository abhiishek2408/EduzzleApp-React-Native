import multer from "multer";

const storage = multer.memoryStorage(); // Store in memory
const upload = multer({ storage });

export default upload;
