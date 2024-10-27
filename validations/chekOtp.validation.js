import Joi from 'joi';
import sendOtpSchema from './sendOtp.validation.js';
import AuthController from '../controllers/auth/auth.controller.js';

const checkOtpSchema = sendOtpSchema.keys({
    code: Joi.string()
        .length(AuthController.OTP_DIGITS)
        .required()
        .messages({
            'string.length': `OTP must be ${AuthController.OTP_DIGITS} digits long.`,
            'string.empty': 'OTP is required.',
        }),
});

export default checkOtpSchema;
