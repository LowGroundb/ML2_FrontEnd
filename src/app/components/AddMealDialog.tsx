import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { UtensilsCrossed, Search } from "lucide-react";
import { searchFood, FoodItem } from "../data/foodDatabase";

interface AddMealDialogProps {
  onAddMeal: (meal: { name: string; calories: number; protein: number; carbs: number; fats: number }) => void;
}

export function AddMealDialog({ onAddMeal }: AddMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"search" | "portion">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [portion, setPortion] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchFood(query);
    setSearchResults(results);
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setStep("portion");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFood && portion) {
      const portionGrams = Number(portion);
      const multiplier = portionGrams / 100;
      
      onAddMeal({
        name: `${selectedFood.name} (${portionGrams}g)`,
        calories: Math.round(selectedFood.caloriesPer100g * multiplier),
        protein: Math.round(selectedFood.proteinPer100g * multiplier * 10) / 10,
        carbs: Math.round(selectedFood.carbsPer100g * multiplier * 10) / 10,
        fats: Math.round(selectedFood.fatsPer100g * multiplier * 10) / 10,
      });
      
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStep("search");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedFood(null);
    setPortion("");
  };

  const handleBack = () => {
    setStep("search");
    setSelectedFood(null);
    setPortion("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) handleClose();
    }}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
          <UtensilsCrossed className="mr-2 h-5 w-5" />
          Add a Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm max-h-[600px]">
        <DialogHeader>
          <DialogTitle>{step === "search" ? "Search Food" : "Enter Portion"}</DialogTitle>
          <DialogDescription>
            {step === "search" 
              ? "Search for the food you ate from our database."
              : "Enter the portion size in grams."}
          </DialogDescription>
        </DialogHeader>

        {step === "search" ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
            
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {searchResults.length > 0 ? (
                searchResults.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium">{food.name}</p>
                    <p className="text-xs text-gray-500">
                      {food.caloriesPer100g} cal • P: {food.proteinPer100g}g • C: {food.carbsPer100g}g • F: {food.fatsPer100g}g (per 100g)
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  {searchQuery ? "No foods found" : "Start typing to search"}
                </p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedFood?.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedFood?.caloriesPer100g} cal per 100g
              </p>
            </div>

            <div>
              <Label htmlFor="portion">Portion Size (grams)</Label>
              <Input
                id="portion"
                type="number"
                placeholder="e.g., 150"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                required
                autoFocus
              />
            </div>

            {portion && selectedFood && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Nutritional Info ({portion}g):</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Calories:</span>{" "}
                    <span className="font-medium">{Math.round(selectedFood.caloriesPer100g * Number(portion) / 100)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Protein:</span>{" "}
                    <span className="font-medium">{Math.round(selectedFood.proteinPer100g * Number(portion) / 100 * 10) / 10}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Carbs:</span>{" "}
                    <span className="font-medium">{Math.round(selectedFood.carbsPer100g * Number(portion) / 100 * 10) / 10}g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fats:</span>{" "}
                    <span className="font-medium">{Math.round(selectedFood.fatsPer100g * Number(portion) / 100 * 10) / 10}g</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600">
                Add Meal
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}