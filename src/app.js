import cors from "cors";
import express from "express";
import profilesRouter from "#api/profiles";
import usersRouter from "#api/users";
import mealsRouter from "#api/mealLogs";

const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", usersRouter);
app.use("/api/profiles", profilesRouter);
app.use("/api/logs", mealsRouter);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

app.use((err, req, res, next) => {
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
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
