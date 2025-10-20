import NewsSchema from "./schema.js";

const newsValidator = {
  validateNews: (payload) => {
    const { error } = NewsSchema.validate(payload, { abortEarly: false });
    if (error) {
      throw new Error(error.message);
    }
  },
};

export default newsValidator;
