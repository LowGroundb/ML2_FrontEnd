import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dumbbell } from "lucide-react";

interface AddExerciseDialogProps {
  onAddExercise: (exercise: { name: string; caloriesBurned: number }) => void;
}

type ExerciseType = "run" | "walk" | "weightlift" | "custom";

export function AddExerciseDialog({ onAddExercise }: AddExerciseDialogProps) {
  const [open, setOpen] = useState(false);
  const [exerciseType, setExerciseType] = useState<ExerciseType | null>(null);
  const [duration, setDuration] = useState("");
  const [customCalories, setCustomCalories] = useState("");

  // Average calories burned per minute (for a 70kg person)
  const caloriesPerMinute = {
    run: 10,
    walk: 4,
    weightlift: 6,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseType) return;

    let caloriesBurned = 0;
    let exerciseName = "";

    if (exerciseType === "custom") {
      if (!customCalories) return;
      caloriesBurned = Number(customCalories);
      exerciseName = "Custom Exercise";
    } else {
      if (!duration) return;
      const minutes = Number(duration);
      caloriesBurned = Math.round(caloriesPerMinute[exerciseType] * minutes);
      
      const exerciseNames = {
        run: "Running",
        walk: "Walking",
        weightlift: "Weight Lifting",
      };
      exerciseName = `${exerciseNames[exerciseType]} (${minutes} min)`;
    }

    onAddExercise({
      name: exerciseName,
      caloriesBurned,
    });

    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setExerciseType(null);
    setDuration("");
    setCustomCalories("");
  };

  const handleBack = () => {
    setExerciseType(null);
    setDuration("");
    setCustomCalories("");
  };

  const exerciseOptions = [
    { type: "run" as ExerciseType, label: "Running", icon: "🏃", color: "bg-red-100 hover:bg-red-200" },
    { type: "walk" as ExerciseType, label: "Walking", icon: "🚶", color: "bg-blue-100 hover:bg-blue-200" },
    { type: "weightlift" as ExerciseType, label: "Weight Lifting", icon: "🏋️", color: "bg-purple-100 hover:bg-purple-200" },
    { type: "custom" as ExerciseType, label: "Custom", icon: "➕", color: "bg-gray-100 hover:bg-gray-200" },
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) handleClose();
    }}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
          <Dumbbell className="mr-2 h-5 w-5" />
          Add Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{exerciseType ? "Exercise Details" : "Choose Exercise Type"}</DialogTitle>
          <DialogDescription>
            {exerciseType 
              ? exerciseType === "custom" 
                ? "Enter the calories you burned."
                : "Enter the duration of your exercise."
              : "Select the type of exercise you performed."}
          </DialogDescription>
        </DialogHeader>

        {!exerciseType ? (
          <div className="grid grid-cols-2 gap-3">
            {exerciseOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => setExerciseType(option.type)}
                className={`p-4 rounded-lg border-2 border-transparent transition-all ${option.color}`}
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {exerciseType === "custom" ? (
              <div>
                <Label htmlFor="custom-calories">Calories Burned</Label>
                <Input
                  id="custom-calories"
                  type="number"
                  placeholder="e.g., 300"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            ) : (
              <>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                {duration && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                      <span className="text-gray-600">Estimated calories burned:</span>{" "}
                      <span className="font-bold text-lg">
                        {Math.round(caloriesPerMinute[exerciseType] * Number(duration))} cal
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on {caloriesPerMinute[exerciseType]} cal/min
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600">
                Add Exercise
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}