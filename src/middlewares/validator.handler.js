import boom from "@hapi/boom";

const validatorHandler = (schema, property) => {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data);

    if (error) {
      next(boom.badRequest(error));
    }

    next();
  };
};

export default validatorHandler;
