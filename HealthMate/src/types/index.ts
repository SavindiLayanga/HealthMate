export interface HealthMate {
    id: number;
    date: string;
    steps: number;
    calories: number;
    water: number;
}

export interface NewHealthRecord {
    date: string;
    steps: number;
    calories: number;
    water: number;
}

export interface HealthSummary {
    totalSteps: number;
    totalCalories: number;
    totalWater: number;
    recordCount: number;
}       

export interface DailyGoals {
    stepsGoal: number;
    caloriesGoal: number;
    waterGoal: number;
}

export interface FormErrors {
    date?: string;
    steps?: string;
    calories?: string;
    water?: string;
}
