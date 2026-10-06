# 🌱 Nourish

## Elevator Pitch Outline

1. **The Problem:** What friction or gap exists for users right now?
   - The problem is that counting apps use out-of-date caloric and nutritional information or do not have the products/food/recipes available so they have to be manually inputted by the user. They block features that should be free to everyone who wants to take real control of their health. Lastly, they do not encourage or build confidence in their users steps through their food journey.

2. **The Solution:** What is Nourish, and how does it fix that problem?
   - Nourish is a tool to use to ground yourself in realistic numbers, it is a tool to give you back control of your food journey. Powered by Gemini AI, it converts meal entries and photos into accurate nutritional estimates. Use it to monitor, track, and have a cheerleader, who can encourage you along your choices and pathway to making better choices for your nutrition.

3. **Key Value Prop** What makes Nourish distinct or delightful to use?
   - The most distinct thing about this app is the ease of use. Type what you ate, it thinks for you, approve the estimates, monitor the data, that's it. The AI drafts the calculations, and the user approves the estimates. It removes friction and paywalls for basic health tracking.

4. **Target User** Who is this built for?
   - The everyday individual who is looking to take charge of their food journey without having to spend a fortune. This user appreciates simplicity and is looking for a supportive, judgement free experience. They are searching for a tool that brings genuine encouragement to their health goals all the while providing clear, reliable data.

## Elevator Pitch

Nourish is a useful tool for the everyday individual looking to take charge of their food journey with realistic data. Accomplished through a simple chat, Gemini AI converts meal entries and photos into accurate nutritional estimates. It allows the user to approve estimates and monitor data without having to spend a fortune. If you're searching for a tool that brings genuine encouragement to your health goals while providing clear and reliable data, Nourish is the solution.

## Stretch Goals

1. **Migration:** Port the wed-app into a cross-platform mobile application for iOS and Android
2. **Custom Notifications & Reminders:**
   - Daily personalized recommendations
   - User customized reminders to log meals
   - Progress check-ins for nutritional targets
3. **Exporting:** Give users the option to download their data into a CSV
4. **Personalization:** More UI themes / app skin options
5. **Authentication:** Integrate Google OAuth 2.0 to support SSO

## Project Management System

### High-Level Tickets

1. AUTH & Onboarding
   - _Ticket 1.1_ - Landing Page
   - _Ticket 1.2_ - Registration & TDEE Calculation
   - _Ticket 1.3_ - Security (`bcrypt` & hashing)
   - _Ticket 1.4_ - Profile Schema

2. Main Page & Chat Interface
   - _Ticket 2.1_ - Gemini AI Chat
   - _Ticket 2.2_ - Approval & Review Logs
   - _Ticket 2.3_ - Visual Progress Trackers (daily limits for Calories, Protein, Potassium, Sodium and Fiber)
   - _Ticket 2.4_ - Baseline Controls (option to "Edit my baseline")

3. Database Storage & CRUD
   - _Ticket 3.1_ - PostgreSQL (relational schema structuring users, profiles/baselines, and logs)
   - _Ticket 3.2_ - Create logs, Read/Display previous logs, Update log entries after approval, Delete incorrect logs tied to user ID.

4. Dashboard for Reporting & Analytics
   - _Ticket 4.1_ - Averages & Recommentations (data points for user optimizations for goals)
   - _Ticket 4.2_ - Historical Trends (WoW and MoM averages reviewing past 7-28 days of data)

### Ticket Assignments

- **Management Tool:** Using GitHub Projects (Kanban) for managing the project
- **Assignments/Allocation:** All tickets are assigned to the lead developer (solo project workflow)
- **Version Control:** All tickets are linked to their own dedicated feature branches. With GitHub projects I can link commits, pull requests and any other updates

#### Task Execution

1. AUTH and Security layers
2. AI chat and CRUD meal logging
3. UI & Reporting

## Technical Details

### Detailed Database Schema

- Users Table (`users`)
  - `id` PK SERIAL
  - `email` VARCHAR UNIQUE
  - `password_hash` VARCHAR
  - `created_at` TIMESTAMP

- Profiles Table (`profiles`) this is a One to One with `users`
  - `id` PK
  - `user_id` REFERENCING `users.id`
  - `age` INT NN
  - `weight` INT NN
  - `height` INT NN
  - `activity_level` VARCHAR (for example "sedentary", "moderate", "active")
  - `calculated_tdee` INT NN
  - `target_calories` INT NN
  - `target_protein` INT NN
  - `target_potassium` INT NN
  - `target_sodium` INT NN
  - `target_fat` INT NN
  - `target_carbs` INT NN
  - `target_fiber` INT NN

- Meal Logging Table (`meal_logs`) this is a One to Many with `users`
  - `id` PK
  - `user_id` REFERENCING `users.id`
  - `meal_description` TEXT (raw or photo reference) NN
  - `status` VARCHAR NN (for example "Pending" or "Approved")
  - `logged_at` TIMESTAMP

- Log Nutrients Table (`log_nutrients`) this is a One to One with `meal_logs`
  - `id` PK
  - `meal_log_id` REFERENCING `meal_logs.id`
  - `calories` INT NN
  - `protein` INT NN
  - `carbs` INT NN
  - `fat` INT NN
  - `fiber` INT NN
  - `sodium` INT NN
  - `potassium` INT NN

### API Endpoints

- AUTH Routes
  - `POST /api/auth/register` - Creates a new user on `users` and initializes the baseline information on `profiles`
  - `POST /api/auth/login` - Authenticates user using bcrypt from `users`

- Meal Log Routes
  - `POST /api/logs` - Creates a new log on `meal_logs` from matching user.id on `users`
  - `GET /api/logs` - Reads and displays previous logs on `meal_logs` from matching user.id on `users`
  - `PUT /api/logs/:id` - Updates log in `meal_logs` and changes status to "approved" after review on matching user.id on `users`
  - `DELETE /api/logs/:id` - Deletes an erroneous log in `meal_logs` on matching user.id on `users`

- Profile Routes
  - `GET /api/profile` - Fetches user targets and baseline data from `profiles` on matching user.id on `users`
  - `PUT /api/profile` - Updates user baseline targets on `profiles` on matching user.id on `users`

### Wireframe for frontend

![Login Page](imgs-wf\login-page.png)

![Register/Create profile page]([imgs-wf\registration-page.png](https://github.com/cjzelano-galixie/nourish/blob/main/imgs-wf/registration-page.png)) ![TDEE Calculation Confirmation]([imgs-wf\tdee-calc.png](https://github.com/cjzelano-galixie/nourish/blob/main/imgs-wf/tdee-calc.png))

![AI Chat page collapsed progress bars]([imgs-wf\AI-chat-page2.png](https://github.com/cjzelano-galixie/nourish/blob/main/imgs-wf/AI-chat-page2.png)) ![AI Chat page with theme and drop-down for quick progress tracker]([imgs-wf\AI-chat-page.png](https://github.com/cjzelano-galixie/nourish/blob/main/imgs-wf/AI-chat-page.png))

![Analytics Page]([imgs-wf\analytics-page.png](https://github.com/cjzelano-galixie/nourish/blob/main/imgs-wf/analytics-page.png))

### User Story for MVP Feature

- **Onboarding & Setting a Baseline**
  - As a... _new user_
  - I want to... enter my demographics to register and automatically calculate my daily maintenance energy expenditure (TDEE)
  - So that... I have personalized data-baked starting point for my food journey without guessing

- **AUTH & Security**
  - As a... _returning user_
  - I want to... securely log in using my email and password
  - So that... my personal nutritional data and meal history remains private and links to my account

- **Meal Log Approval & CRUD Ops**
  - As a... _user tracking daily meals_
  - I want to... type a natural description of what I ate into the chat
  - So that... Gemini AI can instantly provide the meal details with estimates of calories & nutrients for a review & approval

- **Progress & Monitoring**
  - As a... _health-conscious user_
  - I want to... view real-time progress bars for calories, and most macro nutirents on my dashboard (potassium, protein, sodium, fat, carbs, and fiber)
  - So that...I can monitor my daily nutritional intake against my goals
