import React from "react";
import styled from "styled-components/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Logo = styled.Image`
  width: 100px;
  height: 100px;
  margin-top: 40px;
`;

const SurveyPage = ({ navigation }) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F8FF" />
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Logo source={require("./DWA-logo.png")} />
            <Text style={styles.title}>Durham Yearly Workforce Survey</Text>
            <View style={styles.taglineContainer}>
              <Text style={styles.tagline}>Have your say</Text>
              <View style={styles.taglineUnderline} />
            </View>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.buttonPrimary}>
              <LinearGradient
                colors={["#75B555", "#649A47"]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonTextPrimary}>
                  Take the 2026 Survey
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Join DWA</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonTextSecondary}>Get back in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSecondary}
              onPress={() => navigation.navigate("Signup")}
            >
              <Text style={styles.buttonTextSecondary}>Sign up now</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2025 Durham Workforce Authority
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FF",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0077C2",
    marginTop: 20,
    fontStyle: "italic",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 119, 194, 0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  taglineContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 40,
  },
  tagline: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0077C2",
  },
  taglineUnderline: {
    height: 2,
    width: 60,
    backgroundColor: "#649A47",
    marginTop: 8,
    borderRadius: 1,
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: 12,
  },
  buttonPrimary: {
    borderRadius: 12,
    marginBottom: 30,
    elevation: 4,
    shadowColor: "#649A47",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: "hidden",
  },
  buttonGradient: {
    padding: 18,
    alignItems: "center",
    borderRadius: 12,
  },
  buttonTextPrimary: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#CCDDEE",
  },
  dividerText: {
    color: "#0077C2",
    fontWeight: "bold",
    paddingHorizontal: 16,
    fontSize: 16,
  },
  buttonSecondary: {
    borderColor: "#649A47",
    borderWidth: 1.5,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    backgroundColor: "rgba(100, 154, 71, 0.05)",
  },
  buttonTextSecondary: {
    color: "#649A47",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingBottom: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#89A1B8",
    fontSize: 12,
  },
});

export default SurveyPage;
