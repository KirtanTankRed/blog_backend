const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Define the uploads folder path using __dirname to make it platform-independent
const uploadPath = path.join(__dirname, 'uploads');

// Timeout duration in milliseconds (e.g., 5 seconds)
const TIMEOUT_DURATION = 5000;

// Function to handle timeout
function timeoutPromise(timeout) {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Directory creation timed out')), timeout)
    );
}

// Ensure the uploads directory exists asynchronously with timeout
async function ensureUploadDirectory() {
    try {
        // Try to check if the directory exists (without blocking)
        await Promise.race([
            fs.access(uploadPath), // Check if the directory exists
            timeoutPromise(TIMEOUT_DURATION) // Timeout if it takes too long
        ]);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // Directory doesn't exist, create it with timeout
            try {
                await Promise.race([
                    fs.mkdir(uploadPath, { recursive: true }), // Create directory
                    timeoutPromise(TIMEOUT_DURATION) // Timeout if it takes too long
                ]);
            } catch (mkdirErr) {
                console.error('Failed to create directory:', mkdirErr.message);
                // Handle error (e.g., log it or throw a specific error)
            }
        } else {
            console.error('Error checking directory:', err.message);
            // Handle any other errors
        }
    }
}

// Call the function to ensure the directory exists
ensureUploadDirectory();

// Define storage settings for multer
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, uploadPath); // Correct the path to absolute path
    },
    filename: (request, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')); // Prefix with timestamp and Avoid spaces in filenames
    }
});

// Define file upload options
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
    fileFilter: (request, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

module.exports = upload;
