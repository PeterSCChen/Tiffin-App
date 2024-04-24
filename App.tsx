import "react-native-gesture-handler";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import { AuthProvider } from "./components/authContext";
import * as dbExportMealPlans from "./types/dbExportMealPlans";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

//import { useTailwind } from "nativewind";
//import Config from "react-native-config";

import First from "./screens/First";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";
import Detail from "./screens/Detail";
import Checkout from "./screens/Checkout";

import Home from "./screens/Home";
import Provider from "./screens/Providers";
import Plans from "./screens/Plans";
import { ExportMealPlan } from "./types/dbExportMealPlans";

export type RootStackParamList = {
  First: undefined;
  Login: undefined;
  Signup: undefined;
  Main:
    | undefined
    | { screen: keyof TabNavParamList; params?: { provider?: string }|never };
  Profile: undefined;
  Detail: undefined | { planId? : string };
  Checkout: undefined ;
};

export type TabNavParamList = {
  Home: undefined;
  Provider: undefined | { mealPlanName : string };
  Plans: undefined | { provider?: string, planId?: string};
  Profile: undefined;
};

export type MainTabsProps = BottomTabScreenProps<TabNavParamList, "Home">;

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabNavParamList>();

function MainTabs(): JSX.Element {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Provider"
        component={Provider}
        options={{
          tabBarLabel: "Provider",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="isv" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Plans"
        component={Plans}
        options={{
          tabBarLabel: "Plans",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Octicons name="person" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


function App(): JSX.Element {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="First"
        >
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ title: "Main" }}
          />
          <Stack.Screen
            name="First"
            component={First}
            options={{ title: "First" }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "Login" }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ title: "Signup" }}
          />
          <Stack.Screen
            name="Detail"
            component={Detail}
            options={{ title: "Detail" }}
          />
          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{ title: "Checkout" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
