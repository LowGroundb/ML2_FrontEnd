export interface FoodItem {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
}

export const foodDatabase: FoodItem[] = [
  // Proteins
  { id: "1", name: "Chicken Breast", caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatsPer100g: 3.6 },
  { id: "2", name: "Salmon", caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatsPer100g: 13 },
  { id: "3", name: "Beef", caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatsPer100g: 15 },
  { id: "4", name: "Eggs", caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatsPer100g: 11 },
  { id: "5", name: "Tuna", caloriesPer100g: 132, proteinPer100g: 28, carbsPer100g: 0, fatsPer100g: 1.3 },
  { id: "6", name: "Turkey", caloriesPer100g: 135, proteinPer100g: 30, carbsPer100g: 0, fatsPer100g: 0.7 },
  { id: "7", name: "Shrimp", caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatsPer100g: 0.3 },
  
  // Carbs
  { id: "8", name: "White Rice", caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatsPer100g: 0.3 },
  { id: "9", name: "Brown Rice", caloriesPer100g: 112, proteinPer100g: 2.6, carbsPer100g: 24, fatsPer100g: 0.9 },
  { id: "10", name: "Pasta", caloriesPer100g: 131, proteinPer100g: 5, carbsPer100g: 25, fatsPer100g: 1.1 },
  { id: "11", name: "Bread", caloriesPer100g: 265, proteinPer100g: 9, carbsPer100g: 49, fatsPer100g: 3.2 },
  { id: "12", name: "Oatmeal", caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatsPer100g: 7 },
  { id: "13", name: "Sweet Potato", caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatsPer100g: 0.1 },
  { id: "14", name: "Potato", caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatsPer100g: 0.1 },
  { id: "15", name: "Quinoa", caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatsPer100g: 1.9 },
  
  // Vegetables
  { id: "16", name: "Broccoli", caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatsPer100g: 0.4 },
  { id: "17", name: "Spinach", caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatsPer100g: 0.4 },
  { id: "18", name: "Tomato", caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatsPer100g: 0.2 },
  { id: "19", name: "Carrot", caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatsPer100g: 0.2 },
  { id: "20", name: "Cucumber", caloriesPer100g: 16, proteinPer100g: 0.7, carbsPer100g: 3.6, fatsPer100g: 0.1 },
  
  // Fruits
  { id: "21", name: "Banana", caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatsPer100g: 0.3 },
  { id: "22", name: "Apple", caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatsPer100g: 0.2 },
  { id: "23", name: "Orange", caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatsPer100g: 0.1 },
  { id: "24", name: "Strawberries", caloriesPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 8, fatsPer100g: 0.3 },
  { id: "25", name: "Blueberries", caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatsPer100g: 0.3 },
  
  // Dairy
  { id: "26", name: "Greek Yogurt", caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatsPer100g: 0.4 },
  { id: "27", name: "Milk", caloriesPer100g: 42, proteinPer100g: 3.4, carbsPer100g: 5, fatsPer100g: 1 },
  { id: "28", name: "Cheese", caloriesPer100g: 402, proteinPer100g: 25, carbsPer100g: 1.3, fatsPer100g: 33 },
  
  // Nuts & Seeds
  { id: "29", name: "Almonds", caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatsPer100g: 50 },
  { id: "30", name: "Peanut Butter", caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatsPer100g: 50 },
  { id: "31", name: "Walnuts", caloriesPer100g: 654, proteinPer100g: 15, carbsPer100g: 14, fatsPer100g: 65 },
  
  // Other
  { id: "32", name: "Avocado", caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatsPer100g: 15 },
  { id: "33", name: "Olive Oil", caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatsPer100g: 100 },
];

export function searchFood(query: string): FoodItem[] {
  if (!query) return foodDatabase;
  
  const lowerQuery = query.toLowerCase();
  return foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowerQuery)
  );
}
