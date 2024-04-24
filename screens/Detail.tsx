import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, TabNavParamList } from "../App"; // Adjust the import path as needed
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { format, addDays } from "date-fns";
import CheckBox from "@react-native-community/checkbox";

import {
  fetchFoodItems,
  fetchFoodItemDetails,
  fetchMealPlansByPlanId,
} from "../lib/dbMealPlans";
import {
  ExportMealPlan,
  FoodItem,
  FoodItemType,
  DeliveryDays,
  DayOfWeek,
  RadioGroupFoodItem,
} from "../types/dbExportMealPlans";
import { useAuth } from "../components/authContext";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type PlansRouteProp = RouteProp<TabNavParamList, "Plans">;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 10,
    width: "100%",
    paddingLeft: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  radio: {
    width: 24,
    height: 24,
  },
  mealPlanContainer: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#FE7F00",
    borderRadius: 5,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  priceText: {
    fontSize: 18,
    color: "#black",
    marginBottom: 5,
    textAlign: "center",
  },
  deliveryText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
  },
  mealPlanHeader: {
    marginBottom: 20,
  },
  mealPlanName: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 5,
    color: "#FE7F00",
  },
  foodItemContainer: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#FE7F00",
    borderRadius: 5,
  },
  optionalText: {
    fontSize: 16,
    color: "red",
    marginBottom: 5,
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#FE7F00",
    marginTop: 10,
    marginBottom: 5,
  },
  lineDivider: {
    height: 1,
    backgroundColor: "grey",
    width: "100%",
    marginVertical: 8,
  },
  checkoutButton: {
    backgroundColor: "#FE7F00",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectionContainer: {
    backgroundColor: "#f0f0f0", // A light grey background for the container
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    alignSelf: "stretch",
  },
  optionContainer: {
    flexDirection: "column", // This will stack the buttons vertically
    alignItems: "flex-start", // Align items to the start of the cross axis
    paddingVertical: 10,
  },
  optionButton: {
    flexDirection: "row", // Layout text next to the circle
    alignItems: "center", // Center the text and circle vertically
    marginBottom: 8, // Add some space between the buttons
  },
  optionCircle: {
    marginRight: 10,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FE7F00",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedOptionCircle: {
    marginRight: 10,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FE7F00",
    backgroundColor: "#FE7F00", // Fill color for selected state
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

function Detail() {
  const route = useRoute<PlansRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const planId = route.params?.planId;
  const { user, setOrder } = useAuth();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [mealPlans, setMealPlans] = useState<ExportMealPlan[]>([]);

  useEffect(() => {
    fetchAllMealPlansAndFoodItems(planId ?? "");
  });

  const fetchAllMealPlansAndFoodItems = async (planId: string) => {
    if (planId) {
      try {
        const mealPlansData = await fetchMealPlansByPlanId(planId);
        const mealPlansWithFoodItems = await Promise.all(
          mealPlansData.map(async (mealPlan) => {
            // Fetch food items for each meal plan
            const initialFoodItemsArray = await fetchFoodItems(
              mealPlan.foodItemsId as string
            );

            // Fetch details for each food item and enrich the initial food items array
            const detailedFoodItems = await Promise.all(
              initialFoodItemsArray.map(async (foodItem: FoodItem) => {
                // Handling "select" type food items that contain an items array
                if (foodItem.type === "select" && foodItem.items) {
                  const enrichedSelectItems = await Promise.all(
                    foodItem.items.map(async (selectItem) => {
                      const selectItemDetails = await fetchFoodItemDetails(
                        String(selectItem.foodItemID)
                      );
                      return {
                        ...selectItem,
                        name: selectItemDetails?.name,
                        quantity: selectItemDetails?.quantity,
                      };
                    })
                  );

                  return {
                    ...foodItem,
                    items: enrichedSelectItems, // Attach enriched items array
                  };
                } else {
                  // For food items that directly contain a foodItemID
                  const foodItemDetails = await fetchFoodItemDetails(
                    String(foodItem.foodItemID)
                  );
                  return {
                    ...foodItem,
                    name: foodItemDetails?.name,
                    quantity: foodItemDetails?.quantity,
                  };
                }
              })
            );

            // Format description for each meal plan with its food items
            const formattedDescription = formatDescription(
              mealPlan,
              detailedFoodItems
            );

            return {
              ...mealPlan,
              description: formattedDescription,
              foodItems: detailedFoodItems,
            };
          })
        );

        const sortedMealPlans = sortMealPlans(
          mealPlansWithFoodItems.map((mealPlan) => ({
            ...mealPlan,
            description: [mealPlan.description], // Convert description to an array of strings
          }))
        );
        setMealPlans(sortedMealPlans);
      } catch (error) {
        console.error("Failed to fetch meal plans or food items:", error);
      }
    }
  };

  const sortMealPlans = (mealPlans: ExportMealPlan[]) => {
    return mealPlans.sort((a: ExportMealPlan, b: ExportMealPlan) => {
      if (
        a.subscriptionType === "Monthly" &&
        b.subscriptionType !== "Monthly"
      ) {
        return -1;
      }
      if (
        a.subscriptionType !== "Monthly" &&
        b.subscriptionType === "Monthly"
      ) {
        return 1;
      }
      if (a.subscriptionType === "Trial" && b.subscriptionType !== "Trial") {
        return -1;
      }
      if (a.subscriptionType !== "Trial" && b.subscriptionType === "Trial") {
        return 1;
      }
      // If both have the same subscription type, then sort by price
      return a.price - b.price;
    });
  };

  const daysOrder: (keyof DeliveryDays)[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // This function checks if a specific date should be disabled based on the selected meal plan's delivery days
  const isDeliveryDayDisabled = (
    date: Date,
    planDeliveryDays: DeliveryDays
  ) => {
    const dayOfWeek: DayOfWeek = format(date, "EEEE") as DayOfWeek; // Ensure that the formatted string is a valid key
    return !planDeliveryDays[dayOfWeek]; // Returns true if this day of the week is not a delivery day
  };

  const isPastNoon = () => {
    const now = new Date();
    return now.getHours() >= 12;
  };

  // Calculate the start date; if it's past noon, start from the next day
  const startDate = addDays(new Date(), isPastNoon() ? 1 : 0);

  // Calculate the end date; if it's past noon, add an extra day to the end date
  const endDate = addDays(new Date(), isPastNoon() ? 9 : 8);

  const formatActiveDays = (activeDays: (keyof DeliveryDays)[]) => {
    // Handling different cases based on the number of true days
    let daysDescription = "";
    let areDaysConsecutive = false;
    if (activeDays.length === 1) {
      // If only one day is true, use the first 3 letters followed by "ONLY"
      daysDescription = `${activeDays[0].slice(0, 3)} ONLY`;
    } else if (activeDays.length === 2) {
      // If two days are true, join them with a plus sign followed by "ONLY"
      daysDescription = `${activeDays
        .map((day) => day.slice(0, 3))
        .join(" + ")} ONLY`;
    } else {
      // Check if the active days are consecutive
      areDaysConsecutive = activeDays.every((day, index) => {
        if (index === 0) return true; // Always true for the first element
        const prevDayIndex = daysOrder.indexOf(activeDays[index - 1]);
        const currDayIndex = daysOrder.indexOf(day);
        return currDayIndex - prevDayIndex === 1;
      });

      // Format days by slicing the first three letters
      const formattedDays = activeDays.map((day) => day.slice(0, 3));

      if (areDaysConsecutive) {
        const firstDay = formattedDays[0];
        const lastDay = formattedDays[formattedDays.length - 1];
        daysDescription = `${firstDay} - ${lastDay}`;
      } else {
        daysDescription = formattedDays.join(", ");
      }
    }

    const data = {
      areDaysConsecutive: areDaysConsecutive,
      daysDescription: daysDescription,
    };

    return data;
  };

  const formatDescription = (
    mealPlan: ExportMealPlan,
    foodItems: FoodItem[]
  ): string => {
    const descriptions = foodItems
      .map((item) => {
        let description = "";
        if (item.type === FoodItemType.SINGLE) {
          const isItemIdNotInDeliveryDays = !mealPlan.foodDeliveryDays.some(
            (foodDeliveryDay) => foodDeliveryDay.foodItemID === item.foodItemID
          );

          if (isItemIdNotInDeliveryDays) {
            description = `${item.quantity} ${item.name}`;
          } else {
            const index = mealPlan.foodDeliveryDays.findIndex(
              (foodDeliveryDay) =>
                foodDeliveryDay.foodItemID === item.foodItemID
            );

            if (index !== -1) {
              const activeDays = daysOrder.filter(
                (day) => mealPlan.foodDeliveryDays[index].days[day]
              );

              const data = formatActiveDays(activeDays);

              description = `${item.name} ${data.daysDescription}`;
            }
          }
        } else if (item.type === FoodItemType.SELECT && item.items) {
          const alternateDescriptions = item.items
            .map((alt) => `${alt.quantity} ${alt.name}`)
            .join(" OR ");
          description = `${alternateDescriptions}`;
        } else if (item.type === FoodItemType.OPTIONAL) {
          description = `${item.quantity} ${item.name} (optional)`;
        }
        return description;
      })
      .filter((desc) => desc !== "") // Filter out any empty descriptions
      .join("\n"); // Use newline character to separate items

    return descriptions;
  };

  const toggleOptionalSelection = (selectedItem: FoodItem) => {
    // Map through the foodItems to update the isChecked property
    const updatedFoodItems = foodItems?.map((item) => {
      if (
        item.name === selectedItem.name &&
        item.type === FoodItemType.OPTIONAL
      ) {
        return {
          ...item,
          isSelected: !item.isSelected, // Toggle the isChecked property
        };
      }
      return item;
    });
    // Update the foodItems state with the modified list
    setFoodItems(updatedFoodItems);
  };

  const handleRadioGroupOptionChange = (
    foodItem: FoodItem,
    newValue: string
  ) => {
    // Map through the alternate array to update isSelected based on the newValue
    const updatedRadioGroup =
      foodItem.items?.map((altItem) => ({
        ...altItem,
        isSelected: altItem.name === newValue,
      })) || [];

    // Find and update the food item within the foodItems state
    const updatedFoodItems = foodItems?.map((item) => {
      if (item === foodItem) {
        return {
          ...item,
          items: updatedRadioGroup,
        };
      }
      return item;
    });

    // Update the foodItems state with the modified food item
    setFoodItems(updatedFoodItems);
  };

  const formatDeliveryDays = (mealPlan: ExportMealPlan) => {
    // Convert the planDeliveryDays object into an array of days that are true
    const activeDays = daysOrder.filter(
      (day) => mealPlan.planDeliveryDays[day]
    );

    if (activeDays.length === 0) {
      return "Choose one day from Mon-Sat";
    }

    const data = formatActiveDays(activeDays);

    if (data.areDaysConsecutive) {
      if (mealPlan.subscriptionType === "Trial") {
        return `One time ${activeDays.length} day plan ${data.daysDescription}`;
      }

      return `${activeDays.length} days per week (${data.daysDescription})`;
    } else {
      return `${activeDays.length} days per week (${data.daysDescription})`;
    }
  };

  const calculateTotalPrice = (price: number) => {
    const subtotal = price;
    const taxRate = 0.05; // Example tax rate of 7%
    const tax = subtotal * taxRate;
    const totalPrice = subtotal + tax;

    return totalPrice.toFixed(2); // Return the total price with two decimal places
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mealPlanHeader}></View>
      <Text style={styles.subHeader}>Selected Meal Plans:</Text>
      {mealPlans.map((plan, index) => (
        <View key={index} style={styles.mealPlanContainer}>
          <Text style={styles.nameText}>{plan.name}</Text>
          <Text style={styles.priceText}>Price: {plan.price}</Text>
          <View style={styles.lineDivider} />
          <Text style={styles.deliveryText}>
            Active Days: {formatDeliveryDays(plan)}
          </Text>
          <View style={styles.lineDivider} />
          {plan.description.map((desc, idx) => (
            <Text key={idx} style={styles.descriptionText}>
              {desc}
            </Text>
          ))}
          <View style={styles.selectionContainer}>
            {plan.foodItems
              ?.filter((item) => item.type === FoodItemType.SELECT)
              .map((item, itemIdx) => (
                <View key={itemIdx} style={styles.optionContainer}>
                  <Text style={styles.subHeader}>{item.name} Selections:</Text>
                  {item.items?.map((subItem, subIdx) => (
                    <TouchableOpacity
                      key={subIdx}
                      style={styles.optionButton}
                      onPress={() =>
                        handleRadioGroupOptionChange(item, subItem.name ?? "")
                      }
                    >
                      <View
                        style={
                          subItem.isSelected
                            ? styles.selectedOptionCircle
                            : styles.optionCircle
                        }
                      >
                        <Text style={{ color: "white" }}>
                          {subItem.isSelected ? "●" : ""}
                        </Text>
                      </View>
                      <Text style={styles.optionText}>{`${
                        subItem.quantity ?? ""
                      } ${subItem.name ?? ""}`}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
             {plan.foodItems?.filter(item => item.type === FoodItemType.OPTIONAL).map((item, itemIdx) => (
              <View key={itemIdx} style={styles.optionContainer}>
                <CheckBox
                  value={item.isSelected}
                  onValueChange={() => toggleOptionalSelection(item)}
                />
                <Text style={styles.optionText}>{`${item.quantity} ${item.name} (optional)`}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => navigation.navigate("Checkout")}
      >
        <Text style={styles.checkoutButtonText}>Go to Checkout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
export default Detail;
