import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import logoImage from "figma:asset/c46cae83712d6d225d136b61e45e25452e7b696c.png";
import type { ActivityLevel, FitnessGoal } from "../utils/calorieCalculator";

interface OnboardingData {
  name: string;
  age: string;
  height: string;
  gender: "male" | "female";
  activityLevel: ActivityLevel;
  weight: string;
  fitnessGoal: FitnessGoal;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    age: "",
    height: "",
    gender: "male",
    activityLevel: "moderate",
    weight: "",
    fitnessGoal: "maintain",
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = () => {
    onComplete(data);
  };

  const isStep2Valid = data.name.trim() !== "" && data.age !== "" && data.height !== "";
  const isStep3Valid = data.weight !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-white"
                  : i < step
                  ? "w-2 bg-white/60"
                  : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 min-h-[500px] flex flex-col">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="mb-6">
                <img src={logoImage} alt="McFitness Logo" className="w-64 h-auto mx-auto" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to McFitness!
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-sm">
                Your personal fitness companion to track nutrition, reach your goals, and build healthy habits.
              </p>
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600 mb-6">This helps us calculate your personalized goals</p>

              <div className="flex-1 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What's your name?
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setData({ ...data, gender: "male" })}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        data.gender === "male"
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => setData({ ...data, gender: "female" })}
                      className={`py-3 px-4 rounded-xl font-medium transition-all ${
                        data.gender === "female"
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                {/* Age & Height */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={data.age}
                      onChange={(e) => setData({ ...data, age: e.target.value })}
                      placeholder="Years"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height
                    </label>
                    <input
                      type="number"
                      value={data.height}
                      onChange={(e) => setData({ ...data, height: e.target.value })}
                      placeholder="cm"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Activity Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Physical Activity Level
                  </label>
                  <select
                    value={data.activityLevel}
                    onChange={(e) =>
                      setData({ ...data, activityLevel: e.target.value as ActivityLevel })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="sedentary">Sedentary (little or no exercise)</option>
                    <option value="light">Light (exercise 1-3 days/week)</option>
                    <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                    <option value="active">Active (exercise 6-7 days/week)</option>
                    <option value="very_active">Very Active (intense exercise daily)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isStep2Valid}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Weight & Goals */}
          {step === 3 && (
            <div className="flex-1 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Set your goals</h2>
              <p className="text-gray-600 mb-6">Help us personalize your fitness journey</p>

              <div className="flex-1 space-y-5">
                {/* Current Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.weight}
                      onChange={(e) => setData({ ...data, weight: e.target.value })}
                      placeholder="Enter your weight"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                      kg
                    </span>
                  </div>
                </div>

                {/* Fitness Goal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What's your goal?
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => setData({ ...data, fitnessGoal: "fat_loss" })}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        data.fitnessGoal === "fat_loss"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="font-semibold mb-1">Lose Weight</div>
                      <div className={`text-sm ${data.fitnessGoal === "fat_loss" ? "text-blue-100" : "text-gray-600"}`}>
                        Achieve fat loss with a calorie deficit
                      </div>
                    </button>
                    <button
                      onClick={() => setData({ ...data, fitnessGoal: "maintain" })}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        data.fitnessGoal === "maintain"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="font-semibold mb-1">Maintain Weight</div>
                      <div className={`text-sm ${data.fitnessGoal === "maintain" ? "text-blue-100" : "text-gray-600"}`}>
                        Stay at your current weight
                      </div>
                    </button>
                    <button
                      onClick={() => setData({ ...data, fitnessGoal: "muscle_gain" })}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        data.fitnessGoal === "muscle_gain"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <div className="font-semibold mb-1">Gain Muscle</div>
                      <div className={`text-sm ${data.fitnessGoal === "muscle_gain" ? "text-blue-100" : "text-gray-600"}`}>
                        Build muscle with a calorie surplus
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border-2 border-gray-300 rounded-full font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isStep3Valid}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Final */}
          {step === 4 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <span className="text-5xl">🎉</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                You're all set, {data.name}!
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-sm">
                Now the journey begins! Good luck on your path to better health and fitness.
              </p>
              <button
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Start My Journey
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}