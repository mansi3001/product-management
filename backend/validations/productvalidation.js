const Joi = require("joi");

// Schema for adding a product
const addProductSchema = Joi.object({
  SKU: Joi.string().required(),
  product_name: Joi.string().required(),
  category_id: Joi.number().required(),
  price: Joi.number().required(),
  material_ids: Joi.string().required(),
});

// Schema for updating a product
const updateProductSchema = Joi.object({
  product_name: Joi.string().required(),
  category_id: Joi.number().required(),
  price: Joi.number().required(),
});

module.exports = { addProductSchema, updateProductSchema };
