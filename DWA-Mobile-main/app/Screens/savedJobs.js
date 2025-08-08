import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SavedJobs({ navigation }) {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const saved = await AsyncStorage.getItem("savedJobs");
        if (saved) setSavedJobs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved jobs", e);
      }
    };
    loadSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      const updatedJobs = savedJobs.filter((job) => job.id !== jobId);
      await AsyncStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
      setSavedJobs(updatedJobs);
    } catch (e) {
      console.error("Failed to unsave job", e);
    }
  };

  const renderJobItem = ({ item }) => (
    <View style={styles.jobCard}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => Linking.openURL(item.url)}
      >
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.employer}>{item.employer}</Text>
          <Text style={styles.skillMatch}>Skill Match: {item.skillMatch}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.unsaveButton}
        onPress={() => handleUnsave(item.id)}
      >
        <Icon name="bookmark" size={16} color="#213E64" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Saved Jobs</Text>
        <Icon name="bars" size={20} color="#213E64" />
      </View>

      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#213E64" },
  listContent: { padding: 16 },
  jobCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  jobInfo: { marginRight: 10 },
  jobTitle: { fontSize: 16, fontWeight: "bold", color: "#213E64" },
  employer: { fontSize: 14, color: "#666", marginVertical: 4 },
  skillMatch: { fontSize: 12, color: "#999" },
  unsaveButton: {
    padding: 8,
    marginLeft: 10,
  },
});
