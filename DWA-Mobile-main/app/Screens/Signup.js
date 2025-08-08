import React, { useState } from "react";
import styled from "styled-components/native";
import axios from "axios";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Logo = styled.Image`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  align-self: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #0056b3;
  margin-bottom: 10px;
  text-align: center;
`;

const InputContainer = styled.View`
  width: 100%;
  margin-bottom: 10px;
  position: relative;
`;

const Input = styled.TextInput`
  width: 100%;
  padding: 15px;
  padding-right: 50px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-size: 16px;
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
  margin-top: 20px;
`;

const FooterText = styled.Text`
  font-size: 14px;
  color: #555555;
  text-align: center;
`;

const FooterLink = styled.Text`
  color: #0056b3;
  text-decoration-line: underline;
`;

const ErrorText = styled.Text`
  color: red;
  margin-bottom: 10px;
  font-size: 12px;
`;

// Validation Schema
const SignupSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function SignupScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.0.31:3000/api/auth/register", // do make sure to include your IP address here
        {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        }
      );

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 20,
            flexGrow: 1,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Logo source={require("./DWA-logo.png")} />

          <Title>Account Signup</Title>

          <Formik
            initialValues={{
              fullName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  onChangeText={handleChange("fullName")}
                  onBlur={handleBlur("fullName")}
                  value={values.fullName}
                  placeholderTextColor="#888888"
                />
                {errors.fullName && touched.fullName && (
                  <ErrorText>{errors.fullName}</ErrorText>
                )}

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
                  <ErrorText>{errors.email}</ErrorText>
                )}

                <Label>Password</Label>
                <InputContainer>
                  <Input
                    placeholder="*****************"
                    secureTextEntry={!showPassword}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    placeholderTextColor="#888888"
                  />
                  <TouchableOpacity
                    style={{ position: "absolute", right: 15, top: 15 }}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Icon
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#888888"
                    />
                  </TouchableOpacity>
                </InputContainer>
                {errors.password && touched.password && (
                  <ErrorText>{errors.password}</ErrorText>
                )}

                <Label>Confirm Password</Label>
                <InputContainer>
                  <Input
                    placeholder="*****************"
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={handleChange("confirmPassword")}
                    onBlur={handleBlur("confirmPassword")}
                    value={values.confirmPassword}
                    placeholderTextColor="#888888"
                  />
                  <TouchableOpacity
                    style={{ position: "absolute", right: 15, top: 15 }}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Icon
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#888888"
                    />
                  </TouchableOpacity>
                </InputContainer>
                {errors.confirmPassword && touched.confirmPassword && (
                  <ErrorText>{errors.confirmPassword}</ErrorText>
                )}

                <Button onPress={handleSubmit} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <ButtonText>Sign Up</ButtonText>
                  )}
                </Button>
              </>
            )}
          </Formik>

          <FooterText>
            Already have an account?{" "}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <FooterLink>Log In</FooterLink>
            </TouchableOpacity>
          </FooterText>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
