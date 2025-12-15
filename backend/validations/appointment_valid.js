const Joi= require("joi");

const appointmentSchema= Joi.object({
    provider:Joi.string().required(),
    date:Joi.date().iso().required(),
    notes:Joi.string().allow("")});

module.exports={appointmentSchema};