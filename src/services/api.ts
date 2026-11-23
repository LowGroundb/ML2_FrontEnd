const API_BASE_URL = 'http://localhost:8080/api'; // Notice the /api at the end and port 8080

export const api = {
    // 1. GET /api/user/:userId[cite: 2]
    getUser: async (userId: number) => {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    },

    // 2. GET /api/user/:userId/goals[cite: 2]
    getUserGoals: async (userId: number) => {
        const response = await fetch(`${API_BASE_URL}/user/${userId}/goals`);
        if (!response.ok) throw new Error('Failed to fetch user goals');
        return response.json();
    },

    // 3. GET /api/foods[cite: 1]
    getAllFoods: async () => {
        const response = await fetch(`${API_BASE_URL}/foods`);
        if (!response.ok) throw new Error('Failed to fetch foods');
        return response.json();
    },

    // 4. GET /api/foods/search?query=...[cite: 1]
    searchFoods: async (query: string) => {
        const response = await fetch(`${API_BASE_URL}/foods/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to search foods');
        return response.json();
    },

    // 5. POST /api/users/:userId/meal[cite: 1]
    logMeal: async (userId: number, mealData: any) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/meal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mealData),
        });
        if (!response.ok) throw new Error('Failed to log meal');
        return response.json();
    },

    // 6. POST /api/users/:userId/exercises[cite: 1]
    logExercise: async (userId: number, exerciseData: any) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/exercises`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exerciseData),
        });
        if (!response.ok) throw new Error('Failed to log exercise');
        return response.json();
    }
};