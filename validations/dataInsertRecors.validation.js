import Joi from 'joi';

const dataInsertRecors = Joi.object({
    title: Joi.string().required(),
    userId: Joi.number().integer().required(),
    description: Joi.string().allow(null, ''),
    category: Joi.string().allow(null, ''),
    priority: Joi.number().integer().allow(null),
    isPublic: Joi.boolean().default(false),
});

export default dataInsertRecors;
