import cors from "cors";
import express from "express";
import { errorHandler, internalServerError } from "#middleware/errorHandler";
import profilesRouter from "#api/profiles";
import usersRouter from "#api/users";
import mealsRouter from "#api/mealLogs";
import aiRouter from "#api/ai";

const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/logs", mealsRouter);
app.use("/api/ai", aiRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

app.use(errorHandler);
app.use(internalServerError);

export default app;
