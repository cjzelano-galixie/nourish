export default function dataValidation(fields) {
  return (req, res, next) => {
    for (const field of fields) {
      const value = req.body[field];

      if (["age", "weight", "height", "activityLevel"].includes(field)) {
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          isNaN(Number(value))
        ) {
          return res.status(400).send({
            error: `Validation error: ${field} must be a valid number.`,
          });
        }
      }

      if (["email", "password", "sex"].includes(field)) {
        if (typeof value !== "string" || value.trim() === "") {
          return res.status(400).send({
            error: `Validation error: ${field} must be a non-empty string.`,
          });
        }
      }
    }
    next();
  };
}
