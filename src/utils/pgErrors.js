import { BadRequestError } from "#utils/errors";

export async function handlePgError(fn, options = {}) {
  try {
    return await fn();
  } catch (err) {
    throw translatePgError(err, options);
  }
}

function translatePgError(err, { uniqueColumns = {} } = {}) {
  switch (err.code) {
    case "23505": {
      const column = extractColumn(err.detail);
      if (column && uniqueColumns[column]) {
        return new BadRequestError(uniqueColumns[column]);
      }
      return new BadRequestError(
        column
          ? `${column.charAt(0).toUpperCase() + column.slice(1)} already exists.`
          : "A record with this data already exists.",
      );
    }
    case "23503":
      return new BadRequestError(
        "This operation references a record that does not exist or is still linked elsewhere.",
      );
    case "23502":
      return new BadRequestError(
        `Missing required field: ${err.column || "unknown"}.`,
      );
    case "23514":
      return new BadRequestError(
        "The data provided violates a database check constraint.",
      );
    default:
      return err;
  }
}

function extractColumn(detail) {
  const match = detail?.match(/Key \(([^)]+)\)=/);
  return match ? match[1] : null;
}
