import express from "express";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import { getUserByEmailAndPassword } from "#db/queries/users";

const router = express.Router();

router.post("/login", requireBody(["email", "password"]), async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmailAndPassword(email, password);
  if (!user) return res.status(401).send("Invalid email or password.");
  const token = createToken({ id: user.id });
  res.send(token);
});

export default router;
