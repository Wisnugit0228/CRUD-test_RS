import Joi from "joi";

const NewsSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  image: Joi.optional(),
});

export default NewsSchema;
