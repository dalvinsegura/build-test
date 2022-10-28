export const logErrors = (err, req, res, next) => {
    console.log('logErrors');
  console.error(err);
  next(err);
};

export const errorHandler = (err, req, res, next) => {
    console.log('logHandler');

  res.status(500).json({ menssage: err.message, stack: err.stack });
};

export const boomErrorHandler = (err, req, res, next) => {
    if(err.isBoom) {
        const {output} = err;
        res.status(output.statusCode).json(output.payload);

    }

    next(err);
};


