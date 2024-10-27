import Joi from 'joi';

const sendOtpSchema = new Joi.object({
    phone: Joi.string()
        .pattern(/^(09|\+989)\d{9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Phone number must be a valid 11-digit number.',
            'string.empty': 'Phone number is required.',
        }),
});

export default sendOtpSchema;
