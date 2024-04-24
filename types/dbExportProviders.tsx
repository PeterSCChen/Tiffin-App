import { FoodItem } from "./dbExportMealPlans";

export type ExportProvider = {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    weeklyMenu?: WeeklyMenu;
}

export type WeeklyMenu = {
    Sunday: FoodItem[];
    Monday: FoodItem[];
    Tuesday: FoodItem[];
    Wednesday: FoodItem[];
    Thursday: FoodItem[];
    Friday: FoodItem[];
    Saturday: FoodItem[];
}