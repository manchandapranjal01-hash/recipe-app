import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|gif/;
        const exactMatch = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimeMatch = filetypes.test(file.mimetype);

        if (exactMatch && mimeMatch) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png, webp, gif) are allowed!'));
        }
    }
});

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        const baseUrl = process.env.UPLOAD_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        res.json({ imageUrl: `${baseUrl}/uploads/${req.file.filename}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
