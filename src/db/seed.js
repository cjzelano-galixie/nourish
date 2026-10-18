import pool from "./client.js";
import { createUser } from "./queries/users.js";
import { createProfile } from "./queries/profiles.js";

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

async function seed() {
  const testUser = await createUser("test@test.com", "testpassword1");
  const testProfile = await createProfile(testUser.id, {
    age: 45,
    weight: 145,
    height: 158,
    activityLevel: 3,
    calculatedTdee: 2125,
    targetCalories: 1525,
    targetProtein: 110,
    targetPotassium: 3350,
    targetSodium: 2250,
    targetFat: 78,
    targetCarbs: 145,
    targetFiber: 25,
  });
}
