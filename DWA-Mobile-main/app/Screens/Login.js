import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Styled Components
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
`;

const Logo = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #0056b3;
  margin-bottom: 10px;
`;

const InputWrapper = styled.View`
  width: 100%;
`;

const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-size: 16px;
  color: #555555;
`;

const RememberMeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.View`
  width: 20px;
  height: 20px;
  border: 2px solid #28a745;
  border-radius: 3px;
  margin-right: 10px;
`;

const RememberMeText = styled.Text`
  font-size: 14px;
  color: #555555;
`;

const Button = styled.TouchableOpacity`
  background-color: #0056b3;
  padding: 15px;
  width: 100%;
  border-radius: 5px;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #555555;
  align-self: flex-start;
  margin-bottom: 5px;
`;

const FooterText = styled.Text`
  font-size: 14px;
  color: #555555;
`;

const FooterLink = styled.Text`
  color: #0056b3;
  text-decoration-line: underline;
`;

const LanguageSelector = styled.Text`
  font-size: 14px;
  color: #b22222;
  margin-top: 30px;
`;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const response = await axios.get(
            "http://192.168.0.31:3000/api/auth/verify", // do make sure to include your IP address here
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.valid) {
            console.log("Token is valid, auto-login successful");
            navigation.reset({
              index: 0,
              routes: [{ name: "MainContainer" }],
            });
          } else {
            console.log("Invalid token, clearing storage");
            await AsyncStorage.removeItem("userToken");
          }
        }
      } catch (error) {
        console.log("Token check failed:", error.message);
        await AsyncStorage.removeItem("userToken");
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.0.31:3000/api/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data.success) {
        const token = response.data.token;
        console.log("Login successful! Token:", token);

        await AsyncStorage.setItem("userToken", token);

        navigation.reset({
          index: 0,
          routes: [{ name: "MainContainer" }],
        });
      } else {
        Alert.alert("Error", response.data.message || "Login failed");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <Logo source={require("./DWA-logo.png")} />

          <Title>Get back in</Title>
          <Text>OR</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={{ color: "#0056b3", textDecorationLine: "underline" }}>
              Join DWA
            </Text>
          </TouchableOpacity>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <InputWrapper>
                <Label>Email Address</Label>
                <Input
                  placeholder="Enter your Email Address"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholderTextColor="#888888"
                  keyboardType="email-address"
                />
                {errors.email && touched.email && (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {errors.email}
                  </Text>
                )}

                <Label>Password</Label>
                <Input
                  placeholder="*****************"
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholderTextColor="#888888"
                />
                {errors.password && touched.password && (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {errors.password}
                  </Text>
                )}

                <RememberMeContainer>
                  <Checkbox />
                  <RememberMeText>Remember Me</RememberMeText>
                </RememberMeContainer>

                <Button onPress={handleSubmit} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ButtonText>Log In</ButtonText>
                  )}
                </Button>
              </InputWrapper>
            )}
          </Formik>

          <FooterText>
            Lost your password?{" "}
            <FooterLink onPress={() => navigation.navigate("ResetPassword")}>
              Reset Password
            </FooterLink>
          </FooterText>

          <LanguageSelector>🌐 English (United States)</LanguageSelector>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
