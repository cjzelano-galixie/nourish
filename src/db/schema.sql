DROP TABLE IF EXISTS log_nutrients;
DROP TABLE IF EXISTS meal_logs;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    age INT NOT NULL,
    weight INT NOT NULL,
    height INT NOT NULL,
    activity_level INT NOT NULL DEFAULT 1,
    CHECK (activity_level BETWEEN 1 AND 5),
    calculated_tdee INT NOT NULL,
    target_calories INT NOT NULL,
    target_protein INT NOT NULL,
    target_potassium INT NOT NULL,
    target_sodium INT NOT NULL,
    target_fat INT NOT NULL,
    target_carbs INT NOT NULL,
    target_fiber INT NOT NULL
);

CREATE TABLE meal_logs(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    meal_description TEXT NOT NULL,
    status VARCHAR NOT NULL,
    logged_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE log_nutrients(
    id SERIAL PRIMARY KEY,
    meal_log_id INT REFERENCES meal_logs(id) ON DELETE CASCADE NOT NULL,
    calories INT NOT NULL,
    protein INT NOT NULL,
    carbs INT NOT NULL,
    fat INT NOT NULL,
    fiber INT NOT NULL,
    sodium INT NOT NULL,
    potassium INT NOT NULL
);
