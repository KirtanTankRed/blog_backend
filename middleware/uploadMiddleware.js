const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

const uploadPath = path.join(__dirname, 'uploads');
const TIMEOUT_DURATION = 5000;

async function ensureUploadDirectory() {
    try {
        await Promise.race([fs.access(uploadPath), timeoutPromise(TIMEOUT_DURATION)]);
    } catch (err) {
        if (err.code === 'ENOENT') {
            try {
                await Promise.race([fs.mkdir(uploadPath, { recursive: true }), timeoutPromise(TIMEOUT_DURATION)]);
            } catch (mkdirErr) {
                console.error('Failed to create directory:', mkdirErr.message);
            }
        } else {
            console.error('Error checking directory:', err.message);
        }
    }
}

function timeoutPromise(timeout) {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Directory creation timed out')), timeout)
    );
}

// Ensure uploads folder exists
ensureUploadDirectory();

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});

// Define upload instance
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const isValid = fileTypes.test(path.extname(file.originalname).toLowerCase()) &&
                        fileTypes.test(file.mimetype);
        isValid ? cb(null, true) : cb(new Error('Only image files are allowed'));
    }
});

/**
 * **Dynamic upload middleware**
 * - If request is `multipart/form-data`, allow image upload.
 * - Otherwise, allow only text fields.
 */
const dynamicUploadMiddleware = (req, res, next) => {
    const middleware = req.headers["content-type"]?.startsWith("multipart/form-data")
        ? upload.single("image")
        : upload.none();

    middleware(req, res, next);
};

module.exports = dynamicUploadMiddleware;
