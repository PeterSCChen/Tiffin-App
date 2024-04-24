import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { ExportMealPlan } from '../types/dbExportMealPlans';
import { firestore } from '../firebase_setup/firebase';

export const fetchAllMealPlans = (async (): Promise<any> => {
    const mealPlansCol = collection(firestore, 'mealPlans');
    const mealPlansSnapshot = await getDocs(mealPlansCol);
    const mealPlans = mealPlansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ExportMealPlan[];
    return mealPlans;
})

export async function fetchMealPlanById(mealPlanID: string, fields: string[]): Promise<ExportMealPlan | null> {
  // Create a reference to the document
  const docRef = doc(firestore, 'mealPlans', mealPlanID);

  // Fetch the document
  const docSnap = await getDoc(docRef);

  // Check if the document exists
  if (docSnap.exists()) {
    // Document found, return the data with an explicit type assertion
    const data = docSnap.data();
    const result: Partial<ExportMealPlan> = {};
    fields.forEach((field: string) => {
      result[field as keyof ExportMealPlan] = data[field];
    });
    return result as ExportMealPlan; // Assuring TypeScript that data conforms to the Provider type
  } else {
    // No such document
    console.log('No such document!');
    return null;
  }
}

export async function fetchMealPlansByProviderId(providerId: string): Promise<ExportMealPlan[]> {
    const mealPlansQuery = query(collection(firestore, 'mealPlans'), where('providerId', '==', providerId));
  
    const querySnapshot = await getDocs(mealPlansQuery);
    const mealPlans = querySnapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })) as ExportMealPlan[];
    return mealPlans;
}

export async function fetchMealPlansByPlanId(planId: string): Promise<ExportMealPlan[]> {
  const mealPlansQuery = query(collection(firestore, 'mealPlans'), where('id', '==', planId));

  const querySnapshot = await getDocs(mealPlansQuery);
  const mealPlans = querySnapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })) as ExportMealPlan[];
  return mealPlans;
}

export const fetchFoodItems = async (foodItemsId: string) => {
    const foodItemsDocRef = doc(firestore, 'mealPlanItems', foodItemsId);
    const foodItemsSnapshot = await getDoc(foodItemsDocRef);
  
    if (foodItemsSnapshot.exists()) {
      // Returns the food items data if the document exists
      return foodItemsSnapshot.data().foodItems;
    } else {
      // Handle the case where the document does not exist
      console.error('No such document!');
      return null;
    }
  };

/**
 * Fetches details for a single food item by its ID from the Firestore database.
 * 
 * @param {string} foodItemID The ID of the food item to fetch.
 * @returns An object containing the food item's details, including its name and quantity, or null if not found.
 */
export const fetchFoodItemDetails = async (foodItemID: string) => {
  try {
    const foodItemDocRef = doc(firestore, 'foodItem', foodItemID);
    const foodItemSnapshot = await getDoc(foodItemDocRef);

    if (foodItemSnapshot.exists()) {
      // Assuming the document contains 'name' and 'quantity' fields
      const foodItemData = foodItemSnapshot.data();
      return {
        id: foodItemSnapshot.id, // Optional: include the document ID
        name: foodItemData.name,
        quantity: foodItemData.quantity,
      };
    } else {
      console.log(`No food item found with ID: ${foodItemID}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching food item details:", error);
    return null;
  }
};

  