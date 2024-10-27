import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import FileController from '../controllers/file/data.controller.js';

import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post('/upload-csv-1', authenticate, upload.single('file'), FileController.insertDataFromCsv);

router.post(
    '/upload-csv-2',
    authenticate,
    upload.single('file'),
    FileController.insertDataFromCsvRabbitMQ
);

router.post(
    '/upload-csv-3',
    authenticate,
    upload.single('file'),
    FileController.insertDataFromCsvRowByRowRabbitMQ
);

router.get('/data', authenticate, FileController.getAllData);

router.delete('/data', authenticate, FileController.deleteAllData);

export default router;
