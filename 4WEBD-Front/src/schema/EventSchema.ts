import Joi from 'joi';

export const EventSchema = Joi.object({
  id: Joi.number().optional(),

  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': '"name" should be a type of text',
      'string.empty': '"name" cannot be an empty field',
      'string.min': '"name" should have a minimum length of 3',
      'string.max': '"name" should have a maximum length of 50',
      'any.required': '"name" is a required field'
    }),

  description: Joi.string()
    .max(500)
    .required()
    .messages({
      'string.base': '"description" should be a type of text',
      'string.empty': '"description" cannot be an empty field',
      'string.max': '"description" should have a maximum length of 500',
      'any.required': '"description" is a required field'
    }),

  startDate: Joi.date()
    .required()
    .messages({
      'date.base': '"startDate" should be a valid date',
      'any.required': '"startDate" is a required field'
    }),

  endDate: Joi.date()
    .greater(Joi.ref('startDate'))
    .required()
    .messages({
      'date.base': '"endDate" should be a valid date',
      'date.greater': '"endDate" should be after "startDate"',
      'any.required': '"endDate" is a required field'
    }),

  street: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': '"street" should be a type of text',
      'string.empty': '"street" cannot be an empty field',
      'string.min': '"street" should have a minimum length of 3',
      'string.max': '"street" should have a maximum length of 100',
      'any.required': '"street" is a required field'
    }),

  location: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.base': '"location" should be a type of text',
      'string.empty': '"location" cannot be an empty field',
      'string.min': '"location" should have a minimum length of 3',
      'string.max': '"location" should have a maximum length of 200',
      'any.required': '"location" is a required field'
    }),

  maxCapacity: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': '"maxCapacity" should be a number',
      'number.integer': '"maxCapacity" should be an integer',
      'number.positive': '"maxCapacity" should be a positive number',
      'any.required': '"maxCapacity" is a required field'
    }),

    availableSeats: Joi.number().min(0).max(Joi.ref('maxCapacity')).required(),

  category: Joi.string()
    .optional()
    .messages({
      'string.base': '"category" should be a type of text'
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': '"price" should be a number',
      'number.positive': '"price" should be a positive number',
      'number.precision': '"price" should have at most 2 decimal places',
      'any.required': '"price" is a required field'
    }),
    createdBy: Joi.string().optional().messages({
      'string.base': '"createdBy" should be a type of text',
    }),
    creationDate: Joi.date().required(),

    isActive: Joi.boolean().required().messages({
      'boolean.base': '"isActive" should be a boolean',
      'any.required': '"isActive" is a required field'
    }),
    images: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        size: Joi.number().max(5 * 1024 * 1024).messages({
          'number.max': 'Image size must be less than 5MB.',
        }),
        type: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').messages({
          'string.valid': 'Only JPEG, PNG, and JPG formats are allowed.',
        }),
      })
    )
    .max(1)  
    .messages({
      'array.max': 'You can only upload one main image.',
      'array.base': 'Main image is required.',
    }),
});
