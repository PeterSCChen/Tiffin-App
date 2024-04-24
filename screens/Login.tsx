import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../components/authContext";

const Google = require("../assets/googleLogo.png");
const Facebook = require("../assets/fbicon.png");
const Apple = require("../assets/appleicon.png");

const logo = require("../assets/logo.png");

type NavigationProp = StackNavigationProp<RootStackParamList>;

function Login() {
  const navigation = useNavigation<NavigationProp>();
  const { login /* loginWithApple, loginWithFacebook, loginWithGoogle */ } =
    useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    await login(email, password);
    navigation.navigate("Main", { screen: "Home" });
  };

  /* const handleGoogleSignin = async () =>{
    await loginWithGoogle();
    navigation.navigate('Main', { screen: 'Home' });
  }; */

  /* const handleFacebookSignin = async () =>{
    await loginWithFacebook();
    navigation.navigate('Main', { screen: 'Home' });
  };

  const handleAppleSignin = async () =>{
    await loginWithApple();
    navigation.navigate('Main', { screen: 'Home' });
  }; */

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>TiffinWala</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          value={email}
          onChangeText={setEmail}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.rememberView}>
        <View>
          <Pressable onPress={() => Alert.alert("Forget Password!")}>
            <Text style={styles.forgetText}>Forgot Password?</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
        <Text style={styles.optionsText}>OR LOGIN WITH</Text>
      </View>

      <View style={styles.mediaIcons}>
        <TouchableOpacity /*onPress={handleGoogleSignin}*/>
          <Image source={Google} style={styles.icons} />
        </TouchableOpacity>
        <TouchableOpacity /*onPress={handleFacebookSignin}*/>
          <Image source={Facebook} style={styles.icons} />
        </TouchableOpacity>
        <TouchableOpacity /*onPress={handleAppleSignin}*/>
          <Image source={Apple} style={styles.icons} />
        </TouchableOpacity>
      </View>

      <View style={styles.footerTextContainer}>
        <Text style={styles.footerText}>
          Don't Have Account?
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signup}> Sign Up</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
  },
  image: {
    height: 160,
    width: 170,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 40,
    color: "black",
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#FE7F00",
    borderWidth: 1,
    borderRadius: 7,
  },
  rememberView: {
    width: "100%",
    paddingHorizontal: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  switch: {
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  forgetText: {
    fontSize: 11,
    color: "#FE7F00",
  },
  button: {
    backgroundColor: "#FE7F00",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 50,
  },
  footerTextContainer: {
    marginTop: 20,
  },
  optionsText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "gray",
    fontSize: 13,
    marginBottom: 6,
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23,
  },
  icons: {
    width: 40,
    height: 40,
  },
  footerText: {
    textAlign: "center",
    color: "gray",
  },
  signup: {
    color: "#FE7F00",
    fontSize: 13,
  },
});

export default Login;
