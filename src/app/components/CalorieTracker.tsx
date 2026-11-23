import { Progress } from "./ui/progress";

interface CalorieTrackerProps {
  consumed: number;
  goal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fats: number;
  fatsGoal: number;
}

export function CalorieTracker({ consumed, goal, protein, proteinGoal, carbs, carbsGoal, fats, fatsGoal }: CalorieTrackerProps) {
  const remaining = goal - consumed;
  const percentage = (consumed / goal) * 100;
  const proteinPercentage = (protein / proteinGoal) * 100;
  const carbsPercentage = (carbs / carbsGoal) * 100;
  const fatsPercentage = (fats / fatsGoal) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="text-center mb-4">
        <h2 className="text-gray-500 text-sm mb-2">Daily Calories</h2>
        <div className="flex items-center justify-center gap-4">
          <div>
            <p className="text-4xl font-bold text-blue-600">{consumed}</p>
            <p className="text-xs text-gray-500">Consumed</p>
          </div>
          <span className="text-2xl text-gray-300">/</span>
          <div>
            <p className="text-4xl font-bold text-gray-800">{goal}</p>
            <p className="text-xs text-gray-500">Goal</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          {remaining > 0 ? `${remaining} calories remaining` : `${Math.abs(remaining)} calories over`}
        </p>
      </div>
      
      <Progress value={percentage} className="mb-6" />

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Protein</span>
            <span className="text-sm font-bold text-blue-600">{protein}g / {proteinGoal}g</span>
          </div>
          <Progress value={proteinPercentage} className="bg-blue-100" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Carbs</span>
            <span className="text-sm font-bold text-green-600">{carbs}g / {carbsGoal}g</span>
          </div>
          <Progress value={carbsPercentage} className="bg-green-100" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Fats</span>
            <span className="text-sm font-bold text-orange-600">{fats}g / {fatsGoal}g</span>
          </div>
          <Progress value={fatsPercentage} className="bg-orange-100" />
        </div>
      </div>
    </div>
  );
}