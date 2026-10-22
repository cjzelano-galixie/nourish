import express from "express";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import { getUserByEmailAndPassword } from "#db/queries/users";
import { UnauthorizedError } from "#utils/errors";

const router = express.Router();

router.post(
  "/login",
  requireBody(["email", "password"]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await getUserByEmailAndPassword(email, password);
      if (!user) throw new UnauthorizedError("Invalid email or password.");
      const token = createToken({ id: user.id });
      res.send(token);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
