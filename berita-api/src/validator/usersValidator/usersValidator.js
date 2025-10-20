import { userValidatorSchema } from "./schema.js";

const usersValidator = {
  usersValidate: (payload) => {
    const { error } = userValidatorSchema.validate(payload);
    if (error) {
      throw new Error(error.message);
    }
  },
};

export default usersValidator;
