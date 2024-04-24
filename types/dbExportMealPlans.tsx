export type FoodItem = {
    foodItemID?: number;
    name?: string;
    quantity?: number;
    items?: RadioGroupFoodItem[];
    isSelected?: boolean;
    type: FoodItemType;
};

export type FoodItemDetails = {
    name: string;
    quantity: number;
}

export enum FoodItemType {
    SINGLE = "single",
    SELECT = "select",
    OPTIONAL = "optional"
}

export type RadioGroupFoodItem = {
    foodItemID: number;
    name?: string;
    quantity?: number;
    isSelected: boolean;
    comboID?: number;
}

export type DeliveryDays = {
    Sunday: boolean;
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
};

export type DayOfWeek = keyof DeliveryDays;

type foodDeliveryDays = {
    name: string;
    days: DeliveryDays;
    foodItemID: number;
}

export enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    ETRANSFER = "etransfer"
}

export type DeliveryTime = {
    start: number;
    end: number;
} | null;

export type ExportMealPlan = {
    id: string;
    name: string;
    description: string[];
    price: number;
    vegPrice?: number;
    nonVegPrice?: number;
    imageUrl: string;
    subscriptionType: string;
    planDeliveryDays: DeliveryDays;
    foodDeliveryDays: foodDeliveryDays[];
    foodItems?: FoodItem[];
    foodItemsId?: string;
    firstDeliveryDate?: Date;
    buyerUID?: string;
    providerId?: string;
    paymentMethod: PaymentMethod;
    stripePriceID: string;
    vegStripePriceID?: string;
    nonVegStripePriceID?: string;
    deliveryTime?: DeliveryTime,
    selectedDeliveryDays: DeliveryDays;
    deliveryInstructions?: string;
    specialRequests?: string;
    extraDescription?: string;
    isVeg?: boolean;
    isMenuVariable?: boolean;
    isDaysSelectable?: boolean;
};