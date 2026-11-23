import { UtensilsCrossed, Dumbbell, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Exercise {
  id: string;
  name: string;
  caloriesBurned: number;
}

interface ActivityListProps {
  meals: Meal[];
  exercises: Exercise[];
  onDeleteMeal: (id: string) => void;
  onDeleteExercise: (id: string) => void;
}

export function ActivityList({ meals, exercises, onDeleteMeal, onDeleteExercise }: ActivityListProps) {
  if (meals.length === 0 && exercises.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mb-6 bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4">Today's Activity</h3>
      
      {meals.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            Meals
          </h4>
          <div className="space-y-2">
            {meals.map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{meal.name}</p>
                  <p className="text-xs text-gray-600">
                    {meal.calories} cal • P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteMeal(meal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {exercises.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Exercises
          </h4>
          <div className="space-y-2">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{exercise.name}</p>
                  <p className="text-xs text-gray-600">
                    {exercise.caloriesBurned} cal burned
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteExercise(exercise.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}