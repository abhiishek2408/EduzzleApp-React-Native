// --- File where 'upload' is defined (e.g., /config/multer.js or top of userRoutes.js) ---
import multer from 'multer';

// 1. Define storage using memoryStorage()
const storage = multer.memoryStorage();

// 2. Initialize Multer instance with memory storage
// Note: You can also add limits here if needed, e.g., for file size
export const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 5 * 1024 * 1024 // 5MB limit, adjust as needed
    } 
});

// --- End of Multer Initialization ---