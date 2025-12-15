const Joi = require("joi");

exports.profileSchema = Joi.object({
  bio: Joi.string().allow(""),
  phone: Joi.string().allow(""),
  address: Joi.string().allow(""),
  avatar: Joi.string().uri().allow("")
});
