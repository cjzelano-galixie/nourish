import { BadRequestError } from "./errors";

export function handlePgError(err) {
  if (!err.code) {
    throw err;
  }

  switch (err.code) {
    case "23505": {
      const field = extractFieldFromDetail(err.detail);
      const message = field
        ? `${field} already exists.`
        : `A record with this data already exists.`;
      throw new BadRequestError(message);
    }

    case "23503": {
      throw new BadRequestError(
        `This operation references a record that does not exist or is still linked elsewhere,`,
      );
    }

    case "23502": {
      const field = err.column || "unknown";
      throw new BadRequestError(`Missing required field: ${field}.`);
    }

    case "23514": {
      throw new BadRequestError(
        `The data provided violates a database check contstraint`,
      );
    }

    default:
      throw err;
  }

  function extractFieldFromDetail(detail) {
    if (!detail) return null;
    const match = detail.match(/Key (.#?)=/);
    if (match && match[1]) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
    return null;
  }
}
