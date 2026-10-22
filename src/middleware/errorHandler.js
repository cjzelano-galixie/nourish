export function errorHandler(err, req, res, next) {
  if (err.status || err.statusCode) {
    return res.status(err.status || err.statusCode).send(err.message);
  }

  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);
    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
}

export function internalServerError(err, req, res, next) {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
}
