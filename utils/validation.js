const Joi = require('joi');

const addSchoolSchema = Joi.object({
  name: Joi.string().min(1).max(255).required().messages({
    'string.empty': 'School name is required',
    'string.max': 'School name must be less than 255 characters'
  }),
  address: Joi.string().min(1).max(500).required().messages({
    'string.empty': 'Address is required',
    'string.max': 'Address must be less than 500 characters'
  }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude must be a valid number',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required'
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude must be a valid number',
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required'
  })
});

const listSchoolsSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude must be a valid number',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required'
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude must be a valid number',
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required'
  })
});

module.exports = {
  addSchoolSchema,
  listSchoolsSchema
};