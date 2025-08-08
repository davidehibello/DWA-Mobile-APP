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

export default function LanguageSettings({ navigation }) {
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
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bars" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.settingsList}>
        <View style={styles.contentCard}>
          <Text style={styles.header2}>
            The DWA app uses the same language that is currently set on your device
          </Text>

          {/* Important to know Section */}
          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <Icon name="exclamation-circle" size={18} color="#213E64" />
              <Text style={styles.infoTitle}>Important to know:</Text>
            </View>
            <Text style={styles.infoText}>
              You can change the preferred language for an app only if more than one language is
              installed on your device.
            </Text>
          </View>

          {/* Steps to set preferred language */}
          <Text style={styles.subHeader}>To set your preferred language:</Text>
          <View style={styles.stepContainer}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>
                <Text style={styles.boldText}>Open the Settings</Text> app on your device.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>
                Scroll down and tap <Text style={styles.boldText}>Apps</Text>.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>
                Find <Text style={styles.boldText}>DWA</Text> and tap it.
              </Text>
            </View>

            {/* Notice about different device layouts */}
            <View style={styles.noticeBox}>
              <Icon name="info-circle" size={16} color="#213E64" style={styles.noticeIcon} />
              <Text style={styles.noticeText}>
                <Text style={styles.italicText}>If your device has a different menu layout, </Text>
                you can search for <Text style={styles.boldText}>DWA</Text> in the{" "}
                <Text style={styles.boldText}>Settings</Text> app to access it.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>
                Under <Text style={styles.boldText}>Preferred Language</Text>, tap{" "}
                <Text style={styles.boldText}>Language</Text>.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>5</Text>
              </View>
              <Text style={styles.stepText}>
                Select your preferred language from the list. The change is saved automatically.
              </Text>
            </View>
          </View>

          {/* Description about content */}
          <View style={styles.descriptionBox}>
            <Icon name="language" size={20} color="#213E64" style={styles.descriptionIcon} />
            <Text style={styles.description}>
              All DWA-generated content, such as page titles and menus, will display in the
              language you select. Member-generated content, such as posts, articles, group discussions,
              and recommendations will display in the language in which it was written. You can choose to
              translate, if needed.
            </Text>
          </View>
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
  contentCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Text Styles
  header2: {
    fontSize: 18,
    fontWeight: "600",
    color: "#213E64",
    marginBottom: 20,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: "#E8F0FE",
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontWeight: "600",
    color: "#213E64",
    marginLeft: 8,
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#4F4F4F",
    lineHeight: 20,
  },
  subHeader: {
    fontSize: 17,
    fontWeight: "600",
    color: "#213E64",
    marginBottom: 15,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  stepNumber: {
    backgroundColor: "#213E64",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepNumberText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#4F4F4F",
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "600",
    color: "#213E64",
  },
  noticeBox: {
    backgroundColor: "#F4F6F9",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  noticeIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    color: "#4F4F4F",
    lineHeight: 20,
  },
  italicText: {
    fontStyle: "italic",
  },
  descriptionBox: {
    flexDirection: "row",
    marginTop: 15,
  },
  descriptionIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: "#4F4F4F",
    lineHeight: 22,
  },
});