import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  TextStyle,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, TabNavParamList } from "../App"; // Adjust the import path as needed
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { format, addDays, isSunday } from "date-fns";
import RNPickerSelect from "react-native-picker-select";
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
} from "../types/dbExportMealPlans";
import { useAuth } from "../components/authContext";
import CalendarPicker from "react-native-calendar-picker";

type NavigationProp = StackNavigationProp<RootStackParamList>;
type PlansRouteProp = RouteProp<TabNavParamList, "Plans">;

const styles = StyleSheet.create({
  mealPlanContainer: {
    padding: 10,
    marginVertical: 50,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#FE7F00",
    borderRadius: 10,
    zIndex: 1,
    overflow: "visible",
  },
  lineDivider: {
    height: 1,
    backgroundColor: "grey",
    width: "100%",
    marginVertical: 8,
    zIndex: 2,
  },
  nameText: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 5,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
    textAlign: "center",
  },
  priceText: {
    fontSize: 18,
    color: "black",
    marginBottom: 5,
    textAlign: "center",
  },
  deliveryText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
    textAlign: "center",
  },
  subHeader: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#FE7F00",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },
  checkoutButton: {
    backgroundColor: "#FE7F00",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectionContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderColor: "#FE7F00",
    marginVertical: 20,
    alignSelf: "stretch",
  },
  optionContainer: {
    flexDirection: "column",
    paddingVertical: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
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
    backgroundColor: "#FE7F00",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  pickerSelectContainer: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    padding: 10,
    marginHorizontal: 20,
  },
  pickerSelectStyle: {
    inputIOS: {
      color: "black",
      paddingTop: 13,
      paddingHorizontal: 10,
      paddingBottom: 12,
    },
    inputAndroid: {
      color: "black",
    },
  } as TextStyle,
  modalView: {
    zIndex: 999,
    flex: 2,
    justifyContent: "center",
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 7,
  },
  selectDateButton: {
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "stretch",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
  },
  selectDateText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
  },
  formButton: {
    backgroundColor: "#FE7F00",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  formButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: 300,
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
  },
  showFormButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  showFormButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  showFormButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  checkoutConditions: {
    textAlign: "center",
    marginTop: 10,
    color: "red",
  },
  specialRequestInput: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    textAlignVertical: "top",
  },
  deliveryInstructionInput: {
    height: 80,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#FE7F00",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

function Detail() {
  const route = useRoute<PlansRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const planId = route.params?.planId;
  const { user, setOrder } = useAuth();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [mealPlans, setMealPlans] = useState<ExportMealPlan[]>([]);

  const fetchAllMealPlansAndFoodItems = useCallback(async (planId: string) => {
    if (planId) {
      try {
        const mealPlansData = await fetchMealPlansByPlanId(planId);
        const mealPlansWithFoodItems = await Promise.all(
          mealPlansData.map(async (mealPlan) => {
            const initialFoodItemsArray = await fetchFoodItems(
              mealPlan.foodItemsId as string
            );

            const detailedFoodItems = await Promise.all(
              initialFoodItemsArray.map(async (foodItem: FoodItem) => {
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
                    items: enrichedSelectItems,
                  };
                } else {
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
            description: [mealPlan.description],
          }))
        );

        setMealPlans(sortedMealPlans);
        setFoodItems(
          sortedMealPlans.flatMap((plan) => plan.foodItems).filter((item): item is FoodItem => item !== undefined) 
        );

        const hasSelectableItems = mealPlansWithFoodItems.some((mealPlan) =>
          mealPlan.foodItems.some((item) => item.type === FoodItemType.SELECT)
        );
        setIsOptionSelected(!hasSelectableItems);
      } catch (error) {
        console.error("Failed to fetch meal plans or food items:", error);
      }
    }
  }, []); 

  useEffect(() => {
    fetchAllMealPlansAndFoodItems(planId ?? ""); 
  }, [planId]);

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

  const formatActiveDays = (activeDays: (keyof DeliveryDays)[]) => {
    let daysDescription = "";
    let areDaysConsecutive = false;
    if (activeDays.length === 1) {
      daysDescription = `${activeDays[0].slice(0, 3)} ONLY`;
    } else if (activeDays.length === 2) {
      daysDescription = `${activeDays
        .map((day) => day.slice(0, 3))
        .join(" + ")} ONLY`;
    } else {
      areDaysConsecutive = activeDays.every((day, index) => {
        if (index === 0) return true;
        const prevDayIndex = daysOrder.indexOf(activeDays[index - 1]);
        const currDayIndex = daysOrder.indexOf(day);
        return currDayIndex - prevDayIndex === 1;
      });

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
      .filter((desc) => desc !== "")
      .join("\n");

    return descriptions;
  };

  const handleRadioGroupOptionChange = useCallback((foodItem: FoodItem, newValue: string) => {
    const updatedFoodItems = foodItems.map(item => {
      if (item.foodItemID === foodItem.foodItemID) {
        const updatedItems = item.items?.map(altItem => ({
          ...altItem,
          isSelected: altItem.name === newValue,
        }));
        return { ...item, items: updatedItems };
      }
      return item;
    });

    setFoodItems(updatedFoodItems);
    setIsOptionSelected(true);
  }, [foodItems]);

  const formatDeliveryDays = (mealPlan: ExportMealPlan) => {
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

  const [date, setDate] = useState<Date | null>(null); 
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [isFormFilled, setIsFormFilled] = useState<boolean>(false);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const isPastNoon = useMemo(() => new Date().getHours() >= 12, []);

  const startDate = useMemo(
    () => addDays(new Date(), isPastNoon ? 1 : 0),
    [isPastNoon]
  );
  const endDate = useMemo(
    () => addDays(new Date(), isPastNoon ? 9 : 8),
    [isPastNoon]
  );

  const handleDateChange = (selectedDate: Date) => {
    const newDate = new Date(selectedDate);
    setDate(newDate);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [isFormVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    postalCode: "",
  });

  const [specialRequest, setSpecialRequest] = useState("");
  const [deliveryInstruction, setDeliveryInstruction] = useState("");

  const handleInputChange = (name: string, value: string) => {
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    const isFilled = Object.values(updatedFormData).every(
      (val) => val.trim() !== ""
    );
    setIsFormFilled(isFilled);
  };

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const saveForm = () => {
    setFormVisible(false);
  };

  const checkConditions = () => {
    let unmetConditions = [];
    if (!isOptionSelected) unmetConditions.push("You need to select an option.");
    if (!date) unmetConditions.push("You need to select a date.");
    if (!isFormFilled) unmetConditions.push("You need to fill out the form.");
  
    if (unmetConditions.length > 0) {
      Alert.alert("Unmet Conditions", unmetConditions.join("\n"));
    } else {
      Alert.alert("All conditions are met.");
    }
  };
  

  const handleCheckout = useCallback((plan: ExportMealPlan) => {
    const selectedItems = foodItems
      .flatMap((item) =>
        item.items?.filter((subItem) => subItem.isSelected).map((subItem) => subItem.name) || []
      )
      .filter((item): item is string => item !== undefined);

    const checkoutData = {
      mealPlanName: plan.name,
      description: plan.description.join("\n"),
      price: plan.price,
      selectedDate: date ? date.toISOString() : null,
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        postalCode: formData.postalCode,
      },
      foodItems: foodItems,
      selectedItems: selectedItems,
    };

    navigation.navigate("Checkout", { checkoutData });
  }, [date, formData, foodItems, navigation]);

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
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
                  <View style={styles.lineDivider} />

                  <Text style={styles.subHeader}>{item.name} Selections:</Text>
                  <RNPickerSelect
                    placeholder={{
                      label: "Select an option...",
                      value: null,
                    }}
                    items={
                      item.items?.map((subItem) => ({
                        label: `${subItem.quantity} ${subItem.name}`,
                        value: subItem.name,
                      })) || []
                    }
                    onValueChange={(value) =>
                      handleRadioGroupOptionChange(item, value)
                    }
                    value={
                      item.items?.find((subItem) => subItem.isSelected)?.name
                    }
                    style={{
                      inputIOS: {
                        color: "black",
                        borderColor: "gray",
                        paddingTop: 13,
                        paddingHorizontal: 10,
                        paddingBottom: 12,
                      },
                      inputAndroid: {
                        color: "black",
                        borderColor: "gray",
                      },
                    }}
                  />
                </View>
              ))}
          </View>
          <View style={styles.lineDivider} />

          <TouchableOpacity
            style={styles.selectDateButton}
            onPress={toggleModal}
          >
            <Text style={styles.selectDateText}>
              Currently Selected Date:{" "}
              {date instanceof Date ? format(date, "PPP") : "Invalid date"}
            </Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={toggleModal}
          >
            <View style={styles.modalView}>
              <CalendarPicker
                startFromMonday={true}
                allowRangeSelection={false}
                minDate={startDate}
                maxDate={endDate}
                todayBackgroundColor="#f2e6ff"
                selectedDayColor="#7300e6"
                selectedDayTextColor="#FFFFFF"
                onDateChange={handleDateChange}
                disabledDates={(date) => isSunday(new Date(date))}
                textStyle={{
                  color: "#000000",
                }}
                headingLevel={1}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  padding: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#4CAF50",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={toggleModal}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>OK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F44336",
                    padding: 10,
                    borderRadius: 5,
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "white", fontSize: 16 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View style={styles.lineDivider} />

          <View style={styles.showFormButtonContainer}>
            <TouchableOpacity
              onPress={toggleForm}
              style={styles.showFormButton}
            >
              <Text style={styles.showFormButtonText}>
                {isFormVisible ? "Hide Form" : "Show Form"}
              </Text>
            </TouchableOpacity>
          </View>

          {isFormVisible && (
            <View>
              <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                placeholder="First Name"
                onChangeText={(text) => handleInputChange("firstName", text)}
              />
              <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                placeholder="Last Name"
                onChangeText={(text) => handleInputChange("lastName", text)}
              />
              <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                placeholder="Phone Number"
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
              />
              <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                placeholder="Address"
                onChangeText={(text) => handleInputChange("address", text)}
              />
              <TextInput
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                placeholder="Postal Code"
                onChangeText={(text) => handleInputChange("postalCode", text)}
              />
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveForm}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.subHeader}>Special Requests</Text>
          <TextInput
            style={styles.specialRequestInput}
            placeholder="Please list any dietary restrictions or food allergies here, e.g. gluten intolerance, lactose intolerance, peanut allergies."
            onChangeText={(text) => setSpecialRequest(text)}
            multiline
          />

          <Text style={styles.subHeader}>Delivery Instructions</Text>
          <TextInput
            style={styles.deliveryInstructionInput}
            placeholder="Please provide a ground-level drop-off location, such as a lobby or reception as we cannot deliver to upper floors in apartments/condos."
            onChangeText={(text) => setDeliveryInstruction(text)}
            multiline
          />

          <TouchableOpacity
            style={[
              styles.checkoutButton,
              {
                backgroundColor:
                  isOptionSelected && date && isFormFilled ? "#FE7F00" : "grey",
              },
            ]}
            onPress={() => handleCheckout(plan)}
          >
            <Text style={styles.checkoutButtonText}>Go to Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              { backgroundColor: "#FE7F00", marginTop: 10 },
            ]}
            onPress={checkConditions}
          >
            <Text style={styles.checkoutButtonText}>Check Conditions</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

export default Detail;
