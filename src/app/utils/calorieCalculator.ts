export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type FitnessGoal = "fat_loss" | "maintain" | "muscle_gain";

interface UserMetrics {
  weight: number; // kg
  height: number; // cm
  age: number;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  gender: "male" | "female";
}

// Activity multipliers for TDEE calculation
const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// Goal adjustments for calories
const goalMultipliers: Record<FitnessGoal, number> = {
  fat_loss: 0.8, // 20% deficit
  maintain: 1.0, // maintenance
  muscle_gain: 1.15, // 15% surplus
};

// Protein targets (grams per kg of body weight)
const proteinTargets: Record<FitnessGoal, number> = {
  fat_loss: 2.0, // Higher protein during cut to preserve muscle
  maintain: 1.6,
  muscle_gain: 2.2, // Higher protein for muscle building
};

export function calculateDailyGoals(metrics: UserMetrics) {
  // Calculate BMR using Mifflin-St Jeor Equation
  const bmr = metrics.gender === "male"
    ? (10 * metrics.weight) + (6.25 * metrics.height) - (5 * metrics.age) + 5
    : (10 * metrics.weight) + (6.25 * metrics.height) - (5 * metrics.age) - 161;

  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[metrics.activityLevel];

  // Adjust for fitness goal
  const dailyCalories = Math.round(tdee * goalMultipliers[metrics.fitnessGoal]);

  // Calculate protein (g)
  const protein = Math.round(metrics.weight * proteinTargets[metrics.fitnessGoal]);

  // Calculate fats (g) - 27% of total calories
  const fatsCalories = dailyCalories * 0.27;
  const fats = Math.round(fatsCalories / 9); // 9 calories per gram of fat

  // Calculate carbs (g) - remaining calories
  const proteinCalories = protein * 4; // 4 calories per gram
  const remainingCalories = dailyCalories - proteinCalories - fatsCalories;
  const carbs = Math.round(remainingCalories / 4); // 4 calories per gram of carbs

  return {
    dailyCalories,
    protein,
    carbs,
    fats,
  };
}
