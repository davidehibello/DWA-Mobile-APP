import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Linking,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

export default function Settings({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignout = () => {
    setModalVisible(false);
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#213E64', '#1A4B8C']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Image source={require("./DWA-logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bars" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Settings List */}
      <ScrollView style={styles.settingsList}>
        <View style={styles.settingsCard}>
          <SettingsItem 
            icon="user" 
            label="Account Preference" 
            onPress={() => navigation.navigate("AccountPreferences")} 
          />
          <SettingsItem 
            icon="lock" 
            label="Security" 
            onPress={() => navigation.navigate("Security")} 
          />
          <SettingsItem 
            icon="shield" 
            label="Privacy Policy" 
            onPress={() => Linking.openURL("https://durhamworkforceauthority.ca/privacy-policy/")} 
          />
        </View>

        <View style={styles.settingsCard}>
          <SettingsItem 
            icon="bell" 
            label="Notification Settings" 
            onPress={() => navigation.navigate("NotificationSettings")} 
          />
          <SettingsItem 
            icon="globe" 
            label="Language" 
            onPress={() => navigation.navigate("Language")} 
          />
        </View>

        <View style={styles.settingsCard}>
          <SettingsItem 
            icon="question-circle" 
            label="Help Center" 
            onPress={() => Linking.openURL("https://durhamworkforceauthority.ca/jobs-first-durham/jfd-faqs/")} 
          />
          <SettingsItem 
            icon="sign-out" 
            label="Sign Out" 
            onPress={() => setModalVisible(true)} 
            danger 
          />
        </View>
      </ScrollView>

      {/* Sign Out Modal */}
      <Modal 
        animationType="fade" 
        transparent={true} 
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Icon name="exclamation-circle" size={50} color="#D32F2F" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Confirm Sign Out</Text>
            <Text style={styles.modalText}>Are you sure you want to sign out of your account?</Text>
            <View style={styles.buttonRow}>
              <Pressable 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.button, styles.confirmButton]} 
                onPress={handleSignout}
              >
                <Text style={styles.confirmText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Reusable Component
const SettingsItem = ({ icon, label, onPress, danger = false }) => (
  <TouchableOpacity 
    style={styles.item} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.iconContainer, danger && { backgroundColor: '#FFEBEE' }]}>
      <Icon 
        name={icon} 
        size={18} 
        color={danger ? "#D32F2F" : "#213E64"} 
      />
    </View>
    <Text style={[styles.itemText, danger && { color: "#D32F2F" }]}>{label}</Text>
    <Icon 
      name="chevron-right" 
      size={14} 
      color={danger ? "#D32F2F" : "#999"} 
      style={styles.chevron}
    />
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 30,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 15,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 20,
  },
  settingsList: {
    padding: 15,
  },
  settingsCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#213E64",
  },
  chevron: {
    marginLeft: 10,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 16,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#213E64",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    color: "#666",
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
  },
  confirmButton: {
    backgroundColor: "#D32F2F",
  },
  cancelText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
});