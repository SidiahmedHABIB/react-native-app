import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import SearchJobScreen from "./screens/SearchJobScreen";
import GenerateResumeScreen from "./screens/GenerateResumeScreen";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  GenerateResume: undefined;
  SearchJob: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Layout() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }} // Hides the header for all screens
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="GenerateResume" component={GenerateResumeScreen} />
      <Stack.Screen name="SearchJob" component={SearchJobScreen} />
    </Stack.Navigator>
  );
}
