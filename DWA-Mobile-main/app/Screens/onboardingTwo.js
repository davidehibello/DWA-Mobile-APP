import React from "react";
import styled from "styled-components/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { TextLink, TextLinkContent } from "../../components/styles";

const onboardingOne = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* The background image */}
        <Logo source={require("./onboardingFrame(2).png")} />

        <Text style={styles.title}>JOBS MAP</Text>
        <Text style={styles.subtitle}>
          Visualize your path to success with job locations and transit routes
          at your fingertips.
        </Text>

        <TextLink
          style={styles.skip}
          onPress={() => navigation.navigate("survey")}
        >
          <TextLinkContent style={styles.skipText}>Skip?</TextLinkContent>
        </TextLink>

        {/* Buttons Row */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => navigation.navigate("onboardingOne")}
          >
            <Text style={styles.buttonText1}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("onboardingThree")}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const Logo = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
`;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    position: "absolute",
    bottom: 210,
    color: "#0064B6",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  subtitle: {
    position: "absolute",
    bottom: 165,
    color: "#D54128",
    fontSize: 14,
    fontFamily: "Times New Roman",
    fontWeight: "bold",
    lineHeight: 22,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  skip: {
    position: "absolute",
    bottom: 30,
    color: "#D54128",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 620,
    paddingLeft: 295,
  },
  skipText: {
    color: "#D54128",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "none",
  },
  buttonRow: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row", // Aligns buttons horizontally
    justifyContent: "space-between", // Adds space between the buttons
    width: "85%", // Adjust the row width as needed
  },
  button: {
    backgroundColor: "#649A47",
    paddingVertical: 17,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button1: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#213E64",
  },
  buttonText1: {
    color: "#213E64",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default onboardingOne;
