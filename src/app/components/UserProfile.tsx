import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, Edit2, RotateCcw, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface UserInfo {
  name: string;
  age: string;
  weight: string;
  height: string;
  gender: "male" | "female";
  dailyCalorieGoal: string;
  proteinGoal: string;
  carbsGoal: string;
  fatsGoal: string;
  activityLevel: string;
  fitnessGoal: string;
  goalWeight?: string;
  timePeriod?: string;
}

interface UserProfileProps {
  userInfo: UserInfo;
  onUpdateUserInfo: (info: UserInfo) => void;
}

export function UserProfile({ userInfo, onUpdateUserInfo }: UserProfileProps) {
  const [open, setOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);
  const [editedInfo, setEditedInfo] = useState(userInfo);
  const [useManualMacros, setUseManualMacros] = useState(false);

  const handleSave = () => {
    onUpdateUserInfo(editedInfo);
    setOpen(false);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setOpen(false);
  };

  const handleGoalsSave = () => {
    onUpdateUserInfo(editedInfo);
    setGoalsOpen(false);
  };

  const handleGoalsCancel = () => {
    setEditedInfo(userInfo);
    setUseManualMacros(false);
    setGoalsOpen(false);
  };

  const handleResetApp = () => {
    if (window.confirm("Are you sure you want to reset the app? This will clear all your data and show the onboarding again.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const activityLevels = [
    { value: "sedentary", label: "Sedentary (Little or no exercise)" },
    { value: "light", label: "Light (Exercise 1-3 days/week)" },
    { value: "moderate", label: "Moderate (Exercise 3-5 days/week)" },
    { value: "active", label: "Active (Exercise 6-7 days/week)" },
    { value: "very_active", label: "Very Active (Physical job/Athlete)" },
  ];

  const fitnessGoals = [
    { value: "fat_loss", label: "Fat Loss", description: "20% calorie deficit" },
    { value: "maintain", label: "Maintain Weight", description: "Maintenance calories" },
    { value: "muscle_gain", label: "Muscle Gain", description: "15% calorie surplus" },
  ];

  const getActivityLevelLabel = (value: string) => {
    const level = activityLevels.find(l => l.value === value);
    return level ? level.label : value;
  };

  const getFitnessGoalLabel = (value: string) => {
    const goal = fitnessGoals.find(g => g.value === value);
    return goal ? goal.label : value;
  };

  return (
    <Card className="p-6 bg-white shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold">User Profile</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetApp}
            title="Reset App"
          >
            <RotateCcw className="h-4 w-4 text-gray-600" />
          </Button>
          
          {/* Edit Profile Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditedInfo(userInfo)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[600px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your personal information
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="name" className="text-xs">Name</Label>
                      <Input
                        id="name"
                        value={editedInfo.name}
                        onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age" className="text-xs">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={editedInfo.age}
                        onChange={(e) => setEditedInfo({ ...editedInfo, age: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Gender</Label>
                      <RadioGroup
                        value={editedInfo.gender}
                        onValueChange={(value: "male" | "female") => setEditedInfo({ ...editedInfo, gender: value })}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="text-sm font-normal cursor-pointer">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="text-sm font-normal cursor-pointer">Female</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="weight" className="text-xs">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={editedInfo.weight}
                        onChange={(e) => setEditedInfo({ ...editedInfo, weight: e.target.value })}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-xs">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={editedInfo.height}
                        onChange={(e) => setEditedInfo({ ...editedInfo, height: e.target.value })}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Edit Goals Button */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Goals & Macros</p>
                      <p className="text-xs text-gray-600">Customize your fitness targets</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGoalsOpen(true);
                      }}
                      className="bg-white"
                    >
                      <Target className="h-4 w-4 mr-1" />
                      Edit Goals
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Goals Dialog */}
          <Dialog open={goalsOpen} onOpenChange={setGoalsOpen}>
            <DialogContent className="max-w-md max-h-[600px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Goals & Macros</DialogTitle>
                <DialogDescription>
                  Customize your activity level, fitness goals, and macronutrients
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Fitness Goal</h4>
                  <RadioGroup
                    value={editedInfo.fitnessGoal}
                    onValueChange={(value) => setEditedInfo({ ...editedInfo, fitnessGoal: value })}
                    className="space-y-3"
                    disabled={useManualMacros}
                  >
                    {fitnessGoals.map((goal) => (
                      <div 
                        key={goal.value} 
                        className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer ${
                          useManualMacros 
                            ? 'bg-gray-50 opacity-50 cursor-not-allowed' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <RadioGroupItem 
                          value={goal.value} 
                          id={`goal-${goal.value}`} 
                          className="mt-0.5" 
                          disabled={useManualMacros}
                        />
                        <Label 
                          htmlFor={`goal-${goal.value}`} 
                          className={`flex-1 ${useManualMacros ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="font-medium text-sm">{goal.label}</div>
                          <div className="text-xs text-gray-500">{goal.description}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {useManualMacros && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Disabled in manual mode - you're setting custom macros
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-3">Activity Level</h4>
                  <Select
                    value={editedInfo.activityLevel}
                    onValueChange={(value) => setEditedInfo({ ...editedInfo, activityLevel: value })}
                    disabled={useManualMacros}
                  >
                    <SelectTrigger className={`w-full ${useManualMacros ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {useManualMacros && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      Disabled in manual mode - you're setting custom macros
                    </p>
                  )}
                </div>

                {/* Goal Weight & Time Period */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Weight Goal & Timeline</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goal-weight" className="text-xs">Goal Weight (kg)</Label>
                      <Input
                        id="goal-weight"
                        type="number"
                        value={editedInfo.goalWeight || ""}
                        onChange={(e) => setEditedInfo({ ...editedInfo, goalWeight: e.target.value })}
                        className="h-9"
                        placeholder="e.g., 70"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time-period" className="text-xs">Time Period (weeks)</Label>
                      <Input
                        id="time-period"
                        type="number"
                        value={editedInfo.timePeriod || ""}
                        onChange={(e) => setEditedInfo({ ...editedInfo, timePeriod: e.target.value })}
                        className="h-9"
                        placeholder="e.g., 12"
                      />
                    </div>
                  </div>
                  {editedInfo.goalWeight && editedInfo.weight && (
                    <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-800">
                        {Number(editedInfo.goalWeight) < Number(editedInfo.weight) 
                          ? `🎯 Target: Lose ${(Number(editedInfo.weight) - Number(editedInfo.goalWeight)).toFixed(1)} kg`
                          : Number(editedInfo.goalWeight) > Number(editedInfo.weight)
                          ? `🎯 Target: Gain ${(Number(editedInfo.goalWeight) - Number(editedInfo.weight)).toFixed(1)} kg`
                          : `🎯 Target: Maintain current weight`
                        }
                        {editedInfo.timePeriod && ` in ${editedInfo.timePeriod} weeks`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Manual Macros Toggle */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Macronutrient Goals</h4>
                      <p className="text-xs text-gray-500">Auto-calculate or set manually</p>
                    </div>
                    <Button
                      type="button"
                      variant={useManualMacros ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseManualMacros(!useManualMacros)}
                    >
                      {useManualMacros ? "Manual" : "Auto"}
                    </Button>
                  </div>

                  {useManualMacros ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="manual-calories" className="text-xs">Daily Calories</Label>
                        <Input
                          id="manual-calories"
                          type="number"
                          value={editedInfo.dailyCalorieGoal}
                          onChange={(e) => setEditedInfo({ ...editedInfo, dailyCalorieGoal: e.target.value })}
                          className="h-9"
                          placeholder="e.g., 2000"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="manual-protein" className="text-xs">Protein (g)</Label>
                          <Input
                            id="manual-protein"
                            type="number"
                            value={editedInfo.proteinGoal}
                            onChange={(e) => setEditedInfo({ ...editedInfo, proteinGoal: e.target.value })}
                            className="h-9"
                            placeholder="150"
                          />
                        </div>
                        <div>
                          <Label htmlFor="manual-carbs" className="text-xs">Carbs (g)</Label>
                          <Input
                            id="manual-carbs"
                            type="number"
                            value={editedInfo.carbsGoal}
                            onChange={(e) => setEditedInfo({ ...editedInfo, carbsGoal: e.target.value })}
                            className="h-9"
                            placeholder="250"
                          />
                        </div>
                        <div>
                          <Label htmlFor="manual-fats" className="text-xs">Fats (g)</Label>
                          <Input
                            id="manual-fats"
                            type="number"
                            value={editedInfo.fatsGoal}
                            onChange={(e) => setEditedInfo({ ...editedInfo, fatsGoal: e.target.value })}
                            className="h-9"
                            placeholder="65"
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-800">
                          💡 Manual mode: You're in control! Values won't auto-update based on your activity or goals.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">📊 Your goals will be calculated automatically based on:</p>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">• BMR</span> (Basal Metabolic Rate)</p>
                        <p><span className="font-medium">• Activity Level</span></p>
                        <p><span className="font-medium">• Fitness Goal</span></p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleGoalsCancel} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleGoalsSave} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Save Goals
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Name</p>
          <p className="font-medium">{userInfo.name}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Age</p>
          <p className="font-medium">{userInfo.age} years</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Weight</p>
          <p className="font-medium">{userInfo.weight} kg</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Height</p>
          <p className="font-medium">{userInfo.height} cm</p>
        </div>
        {userInfo.goalWeight && (
          <>
            <div>
              <p className="text-gray-500 text-xs">Goal Weight</p>
              <p className="font-medium">{userInfo.goalWeight} kg</p>
            </div>
            {userInfo.timePeriod && (
              <div>
                <p className="text-gray-500 text-xs">Timeline</p>
                <p className="font-medium">{userInfo.timePeriod} weeks</p>
              </div>
            )}
          </>
        )}
        <div className="col-span-2">
          <p className="text-gray-500 text-xs">Fitness Goal</p>
          <p className="font-medium text-sm">{getFitnessGoalLabel(userInfo.fitnessGoal)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500 text-xs">Activity Level</p>
          <p className="font-medium text-sm">{getActivityLevelLabel(userInfo.activityLevel)}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Daily Calorie Goal</p>
          <p className="font-medium">{userInfo.dailyCalorieGoal} cal</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Protein Goal</p>
          <p className="font-medium">{userInfo.proteinGoal} g</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Carbs Goal</p>
          <p className="font-medium">{userInfo.carbsGoal} g</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Fats Goal</p>
          <p className="font-medium">{userInfo.fatsGoal} g</p>
        </div>
      </div>
    </Card>
  );
}