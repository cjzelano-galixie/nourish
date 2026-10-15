import pool from "#db/db";
import { createUser, getUserById } from "#db/queries/users";

async function seedRun() {
  try {
    await seed();
    console.log("🌱 Database seeded.");
  } catch (err) {
    console.log("❌ Error seeding database:", err);
  } finally {
    await pool.end();
  }
}

seedRun();

async function seed() {}
