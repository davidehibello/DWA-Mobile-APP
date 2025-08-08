import * as React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';

export default function Settings({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#213E64', '#1A4B8C']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Image
          source={require("./DWA-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Security</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bars" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Security List in Card */}
      <ScrollView style={styles.settingsList}>
        <View style={styles.settingsCard}>
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate("EmailSecurity")}
            activeOpacity={0.7}
          >
            <View style={styles.itemContent}>
              <Icon name="envelope" size={18} color="#213E64" style={styles.itemIcon} />
              <Text style={styles.itemText}>Email Address</Text>
            </View>
            <Icon name="angle-right" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate("PhoneNumberSecurity")}
            activeOpacity={0.7}
          >
            <View style={styles.itemContent}>
              <Icon name="mobile" size={20} color="#213E64" style={styles.itemIcon} />
              <Text style={styles.itemText}>Phone Number</Text>
            </View>
            <Icon name="angle-right" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate("PasswordSecurity")}
            activeOpacity={0.7}
          >
            <View style={styles.itemContent}>
              <Icon name="lock" size={18} color="#213E64" style={styles.itemIcon} />
              <Text style={styles.itemText}>Password</Text>
            </View>
            <Icon name="angle-right" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    paddingTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
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
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    marginRight: 15,
    width: 24,
    textAlign: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
});