import multer from 'multer'; //
import path, { extname } from 'path' // Import path for handling file path
import fs from 'fs' // Import fs for interaction with file system

// Create a directory where the files will be stored, defining the path to our uploads folder
const uploadDir = path.join(process.cwd(), "uploads");

// Check if the (uploads) directory exist
// This makes sure our application has a place to store files before trying to save them.
if (!fs.existsSync(uploadDir)) {
    // Create a directory if it doesn't exist
    fs.mkdirSync(uploadDir), { recursive: true }
}

// Setup the storage configuration using multer.diskStorage
const storage = multer.diskStorage({
    // The destination function tells multer where to sav the file on our disk 
    destination: (_req, _file, cb) => {
        cb(null, uploadDir)
    },

    // This filename function lis a bit more involved, it tells what to call the file.
    filename: (_req, file, cb) => {
        // Create a unique suffix using the current date and random number to make sure every file have a unique name
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`

        // Grab extension (e) from the original file name
        const ext = extname(file.originalname);

        // Call cb (callback) to return the new unique file name
        cb(null, `${file.filename}-${uniqueSuffix}${ext}`);
    },
});

// Function to validate and check the file's main type, making sure it's an image before it gets saved
function imageFileFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    // If the mimetype starts with "image/", we call our callback with null and true to accept the file
    if (/^image\//.test(file.mimetype)) {
        cb(null, true);
    } else {
        // If it's not an image, we call the callback with an error (only images can be accepted) 
        cb(new Error("Only images can be uploaded"));
    }
}

// Create and export our main multer instance
const upload = multer ({
    storage, // Our storage configuration
    fileFilter: imageFileFilter, // The newly created imageFileFilter function 
    limits: {fileSize: 5 * 1024 * 1024}, // A limit object to restrict the file size 5mb (5 megabytes)
})

export default upload;



