import { Router } from 'express';
import validateRequest from '../middlewares/validateRequest.middleware.js';
import AuthController from '../controllers/auth/auth.controller.js';
import sendOtpSchema from '../validations/sendOtp.validation.js';
import checkOtpSchema from '../validations/chekOtp.validation.js';
import authenticate from '../middlewares/authenticate.middleware.js';

const router = Router();

router.post('/send-otp', validateRequest(sendOtpSchema), AuthController.sendOtp);

router.post('/check-otp', validateRequest(checkOtpSchema), AuthController.checkOtp);

router.post('/test', authenticate, AuthController.test);

export default router;
