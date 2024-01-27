import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LostPassWord from "@views/auth/LostPassWord";
import SignIn from "@views/auth/SignIn";
import SignUp from "@views/auth/SignUp";
import Verification from "@views/auth/Verification";
import { AuthStackParamList } from "src/@Types/navigation";
import { useSelector } from "react-redux";
import { getAuthState } from "src/store/auth";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const authState = useSelector(getAuthState);
  console.log(authState);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="LostPassWord" component={LostPassWord} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
