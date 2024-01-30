import AuthFormContainer from "@components/AuthFormContainer";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppButton from "@ui/AppButton";
import AppLink from "@ui/AppLink";
import OtpFelid from "@ui/OtpFelid";
import colors from "@utils/colors";
import React, { FC, useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthStackParamList } from "src/@Types/navigation";
import client from "src/api/client";

type Props = NativeStackScreenProps<AuthStackParamList, "Verification">;

const otpFields = new Array(6).fill("");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Verification: FC<Props> = ({ route }) => {
  const [CountDown, setCountDown] = useState<number>(30);
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [canSendRequestNow, setCanSendRequestNow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const { userInfo } = route.params;

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];

    if (value === "Backspace") {
      if (!newOtp[index]) {
        setActiveOtpIndex(index - 1);
      }
      newOtp[index] = "";
    } else {
      setActiveOtpIndex(index + 1);
      newOtp[index] = value;
    }
    setOtp([...newOtp]);
  };

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split("");
      setOtp([...newOtp]);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  const isValidOtp = otp.every((value) => {
    return value.trim();
  });

  const handleSubmit = async () => {
    if (!isValidOtp) return;
    setIsSubmitting(true);
    try {
      console.log(otp);
      const { data } = await client.post("/auth/verify-email", {
        token: otp.join(""),
        userId: userInfo.id,
      });
      navigation.navigate("SignIn");
      console.log("Verification", data);
    } catch (err) {
      console.log("Verification Failed", err);
    }
    setIsSubmitting(false);
  };

  const handleReVerificationRequest = async () => {
    setCountDown(30);
    setCanSendRequestNow(false);
    try {
      const {data} = await client.post("/auth/re-verify-email", {
        userId: userInfo.id,
      });
      console.log("Verification", data);
    } catch (error) {
      console.log("Re-Verification Error", error);
    }
  };

  useEffect(() => {
    if (canSendRequestNow) return;
    const interval = setInterval(() => {
      setCountDown((value) => {
        if (value === 0) {
          setCanSendRequestNow(true);
          clearInterval(interval);
          return 0;
        }
        return (value = value - 1);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [canSendRequestNow]);

  return (
    <AuthFormContainer title="Check Your Email!">
      <View style={styles.inputContainer}>
        {otpFields.map((_, index) => {
          return (
            <OtpFelid
              ref={activeOtpIndex === index ? inputRef : null}
              key={index}
              placeholder="_"
              onKeyPress={({ nativeEvent }) => {
                handleChange(nativeEvent.key, index);
              }}
              keyboardType="numeric"
              onChangeText={handlePaste}
              value={otp[index] || ""}
            />
          );
        })}
      </View>
      <AppButton loading={isSubmitting} title="Submit" onPress={handleSubmit} />
      <View style={styles.appLinkContainer}>
        {CountDown === 0 ? null : (
          <Text style={styles.Countdown}>{CountDown} Sec</Text>
        )}
        <AppLink
          title="Re-Send OTP"
          onPress={handleReVerificationRequest}
          active={canSendRequestNow}
        />
      </View>
    </AuthFormContainer>
  );
};

const styles = StyleSheet.create({
  appLinkContainer: {
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  Countdown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});

export default Verification;
