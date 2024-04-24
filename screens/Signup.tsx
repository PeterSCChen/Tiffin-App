import React, { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Step 1: Import useNavigation
import { useAuth } from "../components/authContext";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList} from "../App"; 

const Google = require("../assets/googleLogo.png");
const Facebook = require("../assets/fbicon.png");
const Apple = require("../assets/appleicon.png");

const logo = require("../assets/logo.png");

type NavigationProp = StackNavigationProp<RootStackParamList>;


function Signup() {
  const navigation = useNavigation<NavigationProp>(); // Step 2: Call useNavigation to get the navigation prop
  const {register,  /* loginWithApple, loginWithFacebook,  loginWithGoogle */} = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSignUp = async () => {
    await register(email,password);
    navigation.navigate('Main', { screen: 'Home' });
  };

  /* const handleGoogleSignup = async () =>{
    await loginWithGoogle();
    navigation.navigate('Main', { screen: 'Home' });
  };
 
  const handleFacebookSignup = async () =>{
    await loginWithFacebook();
    navigation.navigate('Main', { screen: 'Home' });
  };

  const handleAppleSignup = async () =>{
    await loginWithApple();
    navigation.navigate('Main', { screen: 'Home' });
  };  */

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Signup</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="EMAIL"
          value={email}
          onChangeText={setEmail}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {/* <TextInput
          style={styles.input}
          placeholder="USERNAME"
          value={username}
          onChangeText={setUsername}
          autoCorrect={false}
          autoCapitalize="none"
        /> */}
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="CONFIRM PASSWORD"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonView}>
        <Pressable
          style={styles.button}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}> CONFIRM </Text>
        </Pressable>
        <Text style={styles.optionsText}>OR SIGNUP WITH</Text>
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
    color: "#FE7F00",
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
  switch: {
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rememberText: {
    fontSize: 13,
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
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 50,
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

export default Signup;
