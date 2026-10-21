import pool from "#db/client";
import bcrypt from "bcrypt";
import { handlePgError } from "#utils/pgErrors";

export async function createUser(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return handlePgError(
    async () => {
      const {
        rows: [user],
      } = await pool.query(
        `INSERT INTO users
  (email, password)
  VALUES
  ($1, $2)
  RETURNING *
      `,
        [email, hashedPassword],
      );
      return user;
    },
    {
      uniqueColumns: { email: `An account with email ${email} already exists` },
    },
  );
}

export async function getUserByEmailAndPassword(email, password) {
  const {
    rows: [user],
  } = await pool.query(
    `
        SELECT * FROM users where email = $1`,
    [email],
  );
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id) {
  const {
    rows: [user],
  } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return user;
}
