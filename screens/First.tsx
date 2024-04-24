import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../App";
  
const images = {
  MenuBGImage: require("../assets/menuBG.png"),
  LogoImage: require("../assets/logo.png"),
};


type MenuScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "First"
>;

export default function Menu() {
  const navigation = useNavigation<MenuScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={images.MenuBGImage}
        style={styles.imageContainer}
        resizeMode="cover"
      >
        <View style={styles.overlayContainer}>
          {/* Logo in the center */}
          <View style={styles.imageContainer}>
            <Image source={images.LogoImage} style={styles.logo} />
          </View>

          {/* Buttons at the bottom */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.signupButton]}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 58,
  },
  logo: {
    width: 300, // Increased width
    height: 300, // Increased height
    resizeMode: "contain",
    shadowColor: "#000", // Adds shadow for elevation effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Android elevation
    opacity: 0.9, // Slightly reduce opacity if needed
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  signupButton: {
    backgroundColor: "#28a745",
  },
});
