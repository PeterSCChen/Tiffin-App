import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { Feather } from "@expo/vector-icons";

type NavigationProp = StackNavigationProp<RootStackParamList>;

function Home() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* Cart Button */}
      <TouchableOpacity
        style={styles.cartButton} // Add the missing cartButton style
        onPress={() => navigation.navigate("Checkout")} // Assuming you have a Cart screen
      >
        <Feather name="shopping-cart" size={24} color="black" />
        {/* Add the Icon component */}
      </TouchableOpacity>

      {/* Main Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Main", { screen: "Provider" })}
      >
        <Text style={styles.buttonText}>Choose Provider</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  cartButton: {
    position: "absolute",
    right: 20,
    top: 40, // Adjust according to your status bar height
    backgroundColor: "#007bff",
    borderRadius: 50,
    padding: 10,
  },
});

export default Home;
