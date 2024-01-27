import { NavigationContainer } from "@react-navigation/native";
import React, { FC, useEffect } from "react";
import AuthNavigator from "./AuthNavigator";
import { useDispatch, useSelector } from "react-redux";
import {
  getAuthState,
  updateLoggedInState,
  updateProfile,
} from "src/store/auth";
import TabNavigator from "./TabNavigator";
import { Keys, getFromAsyncStorage } from "@utils/asyncStorage";
import client from "src/api/client";

interface Props {}

const AppNavigator: FC<Props> = (props) => {
  const { loggedIn } = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const authInfo = async () => {
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        if (!token) return;
        const { data } = await client.get("/auth/is-auth", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        console.log("authData", data);
        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedInState(true));
      } catch (error) {
        console.log("Authorization Error", error);
      }
    };

    authInfo();
  }, []);

  return (
    <NavigationContainer>
      {loggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
