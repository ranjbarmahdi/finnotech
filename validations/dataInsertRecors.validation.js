import Joi from 'joi';

const dataInsertRecors = Joi.object({
    title: Joi.string().required(),
    userId: Joi.number().integer().required(),
    description: Joi.string().allow(null, ''),
});

export default dataInsertRecors;
