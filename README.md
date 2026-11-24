# ML2_FrontEnd

McFitness is a fitness web app for tracking meals, calories and macronutrients against personal goals. This repository contains the **React + TypeScript frontend**. It talks to the McFitness **Node.js/Express backend** (`ML2_BackEnd`) over HTTP.

## Table of contents

1. [Features](#features)
2. [Tech stack](#tech-stack)
3. [Getting started](#getting-started)
4. [Configuration](#configuration)
5. [Backend API](#backend-api)
6. [How the app works](#how-the-app-works)
7. [Project structure](#project-structure)
8. [Troubleshooting](#troubleshooting)
9. [Known limitations](#known-limitations)

---

## Features

- **4-step onboarding**: welcome, personal details (name, age, gender, height, weight), goal selection (lose weight / maintain / build strength) and weekly activity level.
- **Daily dashboard ("Today")**: calories left, calories eaten and burned, a progress ring, and protein / carbs / fat progress bars.
- **Meal logging**: search the food database, choose a portion size and add the meal to today's log.
- **Exercise logging**: pick an activity and a duration; the estimated calories burned are subtracted from your daily balance.
- **Goals**: change your goal type, goal weight and time period; targets are recalculated automatically.
- **Profile**: edit your personal details.
- **Responsive layout**: sidebar on desktop, bottom navigation on mobile.

## Tech stack

| Area | Technology |
|---|---|
| UI | React, TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Icons / animation | `lucide-react`, `motion` |
| Backend | Node.js + Express (separate repository, `ML2_BackEnd`) |

## Getting started

### Prerequisites

- **Node.js 18 or newer** and npm
- The **backend running locally** (see below)

### 1. Start the backend

In the `ML2_BackEnd` repository:

```bash
npm install
npm start        # use the start script from that repo's package.json
```

The frontend expects the API at **`http://localhost:8080/api`**.

### 2. Start the frontend

In this repository:

```bash
npm install
npm run dev
```

Vite prints the local address, usually **http://localhost:5173**. Open it in your browser.

### 3. Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # serves the production build locally
```

## Configuration

The API address is defined once, at the top of the API file (`api.ts`):

```ts
const API_BASE_URL = 'http://localhost:8080/api';
```

If your backend runs on another host, port or path, change this value. Two things must match your backend setup:

- **Port and prefix**: the routers must be mounted under `/api` (for example `app.use('/api', router)`).
- **CORS**: the frontend and backend run on different origins, so the Express app must enable CORS or the browser will block every request:

  ```js
  const cors = require('cors');   // npm install cors
  app.use(cors());
  ```

## Backend API

Endpoints used by the frontend (all paths are relative to `/api`):

| Purpose | Method and path | Notes |
|---|---|---|
| Load a user's profile | `GET /user/:userId` | 404 if the user does not exist |
| Load a user's goals | `GET /user/:userId/goals` | 404 if the user has no goals yet |
| List all foods | `GET /foods` | Used when the search box is empty |
| Search foods | `GET /foods/search?query=...` | The parameter is named `query`; returns 400 if empty |
| Log a meal | `POST /users/:userId/meal` | Returns `{ message, meal }` |
| Log an exercise | `POST /users/:userId/exercises` | Returns `{ message, exercise }` |

Other endpoints the backend provides (not required for the flows above):

| Purpose | Method and path |
|---|---|
| Create a user | `POST /user` |
| Update weight and height | `PUT /user/:userId` |
| Delete a user | `DELETE /user/:userId` |
| Create a goal | `POST /user/:userId/goals` |
| List all of a user's meals | `GET /users/:userId/meals` |

### Data shapes

```jsonc
// Food (nutrition values are per 100 g)
{ "foodId": 1, "name": "Oats", "caloriesPer100g": 389, "proteinPer100g": 16.9, "carbsPer100g": 66.3, "fatPer100g": 6.9 }

// Meal
{ "mealId": 1, "mealType": "Breakfast", "timestamp": "2026-11-16T08:30:00Z", "totalCalories": 350, "foods": [ /* ... */ ] }

// Exercise
{ "exerciseId": 1, "type": "Running", "durationMinutes": 30, "caloriesBurned": 300, "timestamp": "2026-11-16T18:00:00Z" }

// Goal
{ "goalId": 1, "goalType": "Maintenance", "targetWeight": 69.5, "targetCalories": 2000,
  "targetProtein": 150, "targetCarbs": 200, "targetFat": 65, "timePeriodWeeks": 12 }
```

## How the app works

1. **First launch**: the onboarding flow collects your details. Your daily targets are calculated in the browser with the **Mifflin-St Jeor** equation, adjusted for your activity level and goal.
2. **Dashboard**: *calories left = goal − eaten + burned*. The macro bars compare today's totals with your protein, carbs and fat targets.
3. **Adding a meal**: foods come from the backend. Nutrition values are per 100 g, so you choose a portion in grams and the app scales the values before sending the meal.
4. **Adding an exercise**: the calories burned are estimated from a per-minute rate for the activity (for example, running at 10.5 cal/min) multiplied by the duration.

## Project structure

```
src/
├── main.tsx            # React entry point
├── app/
│   └── App.tsx         # Screens: onboarding, dashboard, meal/exercise/profile/goals dialogs
├── api.ts              # Backend client (fetch wrappers for each endpoint)
└── styles/
    └── index.css       # Tailwind and global styles
```

> Adjust the tree if your folders differ. The key idea is that all HTTP calls live in the API file and UI code only calls those functions.

## Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `Failed to fetch` or a CORS error in the browser console | The backend is not running, or CORS is not enabled. Start the backend and add `app.use(cors())`. |
| Every request returns 404 | The backend routers are not mounted under `/api`, or the port differs from `API_BASE_URL`. |
| "Food not found" for every search | The backend only knows the seeded foods (Oats, Chicken Breast). Search for those, or add foods to `mockData.js`. |
| Your data is gone after restarting the backend | The backend stores everything **in memory**. Restarting it resets all users, goals and meals. |
| Search returns "Query parameter is required" | The search request was sent with an empty `query`. Use `GET /foods` for the full list instead. |

## Known limitations

These come from the current backend, not from the frontend:

- **In-memory storage**: no database, so data does not survive a backend restart.
- **No authentication**: users are identified only by `userId`.
- **No user id from the server**: `POST /user` stores the request body as-is, so the client must send a unique `userId`.
- **No meal or exercise deletion**, and **no endpoint to list exercises**.
- **No goal update route**: each change creates a new goal; the newest one is the current goal.
- **`PUT /user/:userId` only saves weight and height.**
- **`GET /users/:userId/meals` returns every user's meals**, so the frontend must filter them by `userId`.
- **Foods cannot be added** through the API (no `POST /foods`).
