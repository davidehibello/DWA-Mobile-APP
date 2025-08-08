import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
  import { useNavigation } from "@react-navigation/native";


const EmailSecurity = () => {
  const [emailAddress, setEmailAddress] = useState("");
  

  const handleSave = () => {
    if (!emailAddress.trim()) {
      Alert.alert("Error", "Email Address is required.");
      return;
    }
    Alert.alert("Success", "Email Address saved");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo at the top */}
      <Image source={require("./DWA-logo.png")} style={styles.logo} />

      {/* Email Address Input */}
      <Text style={styles.label}>Email Address*</Text>
      <TextInput
        style={styles.input}
        placeholder=""
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      
      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
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
  label: {
    alignSelf: "flex-start",
    marginLeft: 40,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#000",
  },
  input: {
    width: "85%",
    height: 40,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: "85%",
    height: 45,
    backgroundColor: "#1E4FC1",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default EmailSecurity;
