import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

const UserProfile = () => {
  const navigation = useNavigation();
  const profileCompletion = 0.75; // 75%
  const skillsCompletion = 0.0; // 0%

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Header with Gradient Background */}
        <View style={styles.profileHeader}>
          <View style={styles.profileSection}>
            <Image 
              source={require("./profile-image.png")} 
              style={styles.profileImage} 
            />
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileTitle}>Frontend Developer</Text>
          </View>
        </View>

        {/* Profile Strength Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Profile Strength</Text>
          
          <View style={styles.progressItem}>
            <View style={styles.progressInfo}>
              <Ionicons name="person-circle-outline" size={20} color="#2B5CC3" />
              <Text style={styles.progressLabel}>Profile Details</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Progress.Bar 
                progress={profileCompletion} 
                width={200} 
                height={8}
                color="#2B5CC3" 
                unfilledColor="#E8F0FE"
                borderWidth={0}
              />
              <Text style={styles.progressPercentage}>{Math.round(profileCompletion * 100)}%</Text>
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressInfo}>
              <Ionicons name="build-outline" size={20} color="#2B5CC3" />
              <Text style={styles.progressLabel}>Skills</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Progress.Bar 
                progress={skillsCompletion} 
                width={200} 
                height={8}
                color="#2B5CC3" 
                unfilledColor="#E8F0FE"
                borderWidth={0}
              />
              <Text style={styles.progressPercentage}>{Math.round(skillsCompletion * 100)}%</Text>
            </View>
          </View>
        </View>

        {/* Navigation Links */}
        <View style={styles.card}>
          <TouchableOpacity 
            style={styles.menuItem} 
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFEEEE' }]}>
                <Ionicons name="briefcase-outline" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.menuText}>Jobs</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.menuItem} 
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#EEF7FF' }]}>
                <Ionicons name="build-outline" size={20} color="#2B5CC3" />
              </View>
              <Text style={styles.menuText}>Skills</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.menuItem} 
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#F0FFF4' }]}>
                <Ionicons name="document-text-outline" size={20} color="#48BB78" />
              </View>
              <Text style={styles.menuText}>Resumes</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.menuItem} 
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF6EE' }]}>
                <Ionicons name="mail-outline" size={20} color="#ED8936" />
              </View>
              <Text style={styles.menuText}>Cover Letters</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity 
            style={styles.menuItem} 
          >
            <View style={styles.menuItemContent}>
              <View style={[styles.iconContainer, { backgroundColor: '#F8F0FF' }]}>
                <Ionicons name="heart-outline" size={20} color="#9F7AEA" />
              </View>
              <Text style={styles.menuText}>Following</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  profileHeader: {
    backgroundColor: '#2B5CC3',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
    color: '#FFF',
  },
  profileTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: '#333',
  },
  progressItem: {
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: '#555',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    marginLeft: 10,
    color: '#666',
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 2,
  },
});

export default UserProfile;