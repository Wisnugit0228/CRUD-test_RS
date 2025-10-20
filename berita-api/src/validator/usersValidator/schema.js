import Joi from "joi";

export const userValidatorSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
