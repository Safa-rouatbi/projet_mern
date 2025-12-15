const Joi = require("joi");

const serviceSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  price: Joi.number().min(0).required(),
  duration: Joi.number().min(1).required()
});

module.exports = { serviceSchema };
