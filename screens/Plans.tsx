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

import {
  fetchMealPlansByProviderId,
  fetchFoodItems,
  fetchFoodItemDetails,
} from "../lib/dbMealPlans";
import {
  ExportMealPlan,
  FoodItem,
  PaymentMethod,
  FoodItemType,
  DeliveryDays,
} from "../types/dbExportMealPlans";
import { useAuth } from "../components/authContext";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type PlansRouteProp = RouteProp<TabNavParamList, "Plans">;

function Plans() {
  const route = useRoute<PlansRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const providerId = route.params?.provider;
  const [mealPlans, setMealPlans] = useState<ExportMealPlan[]>([]); 

  useEffect(() => {
    const fetchAllMealPlansAndFoodItems = async () => {
      if (providerId) {
        try {
          const mealPlansData = await fetchMealPlansByProviderId(providerId);
          setMealPlans(mealPlansData); // Update state with fetched data
        } catch (error) {
          console.error("Failed to fetch meal plans:", error);
        }
      }
    };

    fetchAllMealPlansAndFoodItems();
  }, [providerId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {mealPlans.sort((a, b) => a.price - b.price) // Assuming 'price' is a number
        .map((mealPlan, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() =>
              navigation.navigate("Detail", {
                planId: mealPlan.id,
              })
            }
          >
            <View style={styles.contentWrapper}>
              <Text style={styles.nameText}>{mealPlan.name}</Text>
              <Text style={styles.buttonText}>{mealPlan.description}</Text>
              <Text style={styles.buttonText}>${mealPlan.price}</Text>
              <Text style={styles.buttonText}>
                Your go-to vegetarian tiffin service, crafting flavorful meals
                with home ground spice blends. Experience the goodness of
                wholesome, locally sourced ingredients in every bite.
              </Text>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  button: {
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    marginBottom: 20, // Adds more space below each button
  },
  contentWrapper: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  buttonIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  nameText: {
    fontWeight: 'bold', // Make the text bold
    fontSize: 30, // Increase the font size
  },
});

export default Plans;
