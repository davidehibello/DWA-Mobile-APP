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
const onboardingFour = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* The background image */}
        <Logo source={require("./onboardingFrame(4).png")} />

        {/* Title */}

        {/* The "Next" button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("survey")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Logo = styled.Image`
  width: 95%;
  height: 100%; /* Ensure it covers the full height */
  position: absolute; /* Ensures layering of content */
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

  button: {
    position: "absolute",
    bottom: 60, // Position the button above the bottom
    backgroundColor: "#649A47",
    paddingVertical: 15,
    paddingHorizontal: 150,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default onboardingFour;
