import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Switch,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

const JobAlertNotificationSettings = () => {
  const [inApp, setInApp] = useState(true);
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image source={require("./DWA-logo.png")} style={styles.logo} />

      {/* Page Title */}
      <Text style={styles.title}>Job Alerts</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Choose where to get notified</Text>

      {/* In-App Notification */}
      <View style={styles.row}>
        <FontAwesome5 name="bell" size={20} color="black" />
        <Text style={styles.optionText}>In-app Notification</Text>
        <Switch
          value={inApp}
          onValueChange={setInApp}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
        />
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Push Notification */}
      <View style={styles.row}>
        <FontAwesome5 name="bell" size={20} color="black" />
        <Text style={styles.optionText}>Push notification</Text>
        <Switch
          value={push}
          onValueChange={setPush}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
        />
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Email Notification */}
      <View style={styles.row}>
        <FontAwesome name="envelope" size={20} color="black" />
        <Text style={styles.optionText}>Email</Text>
        <Switch
          value={email}
          onValueChange={setEmail}
          trackColor={{ false: "#ccc", true: "#4cd964" }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 180,
    height: 40,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
    color: "#555",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginLeft: 10,
  },
  separator: {
    width: "85%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
});

export default JobAlertNotificationSettings;
