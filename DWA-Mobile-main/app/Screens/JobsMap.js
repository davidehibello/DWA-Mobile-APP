//import { useSortedScreens } from "expo-router/build/useScreens";
import Constants from 'expo-constants';
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  TextInput,
} from "react-native";
import { Asset } from 'expo-asset';
import { WebView } from 'react-native-webview';
import { Linking } from 'react-native';
import * as FileSystem from 'expo-file-system';
//import AsyncStorage from 'expo-secure-store'; // expos built-in solution
import Icon from "react-native-vector-icons/FontAwesome";

export default function JobMap() {
  const [htmlUri, setHtmlUri] = useState(null);
  const [showTransit, setShowTransit] = useState(false);
  const [showBikes, setShowBikes] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const webViewRef = useRef(null);

  useEffect(() => {
    (async () => {
      const asset = Asset.fromModule(require("../../assets/jobsMap.html"));
      await asset.downloadAsync();
      setHtmlUri(asset.localUri || asset.uri);
    })();
  }, []);

  const toggleSaveInAsyncStorage = async (job) => {
    try {
      const saved = await AsyncStorage.getItem("savedJobs");
      let savedJobs = saved ? JSON.parse(saved) : [];
  
      const index = savedJobs.findIndex((j) => j.id === job._id);
  
      if (index !== -1) {
        // Unsave job
        savedJobs.splice(index, 1);
      } else {
        // Save job
        savedJobs.push({
          id: job._id,
          title: job.job_title,
          employer: job.employer,
          url: job.url,
          skillMatch: "N/A",
          status: "Interested",
        });
      }
  
      await AsyncStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    } catch (e) {
      console.error("Failed to toggle saved job in AsyncStorage:", e);
    }
  };

  const sendFilterToWebView = (type, value) => {
    const message = JSON.stringify({ type, value });
    webViewRef.current?.postMessage(message);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <Image source={require("./DWA-logo.png")} style={styles.logo} />
          <Text style={styles.headerTitle}>Jobs Map</Text>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        {!htmlUri ? (
          <ActivityIndicator size="large" color="#213E64" />
        ) : (
          <WebView
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ uri: htmlUri }}
            style={styles.map}
            onShouldStartLoadWithRequest={(request) => {
              // Open external links in browser
              if (request.url.startsWith("http") && !request.url.includes("localhost") && !request.url.includes("file://")) {
                Linking.openURL(request.url);
                return false;
              }
              return true;
            }}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
          
                if (data.type === "TOGGLE_SAVE_JOB") {
                  const job = data.job;
                  toggleSaveInAsyncStorage(job);
                }
              } catch (e) {
                console.error("Failed to parse message from WebView:", e);
              }
            }}
          />
        )}
      </View>

      {/* Filters Section */}
      <ScrollView style={styles.filters} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 10, }}>
      <View style={styles.filterSearch}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search jobs or employers"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              sendFilterToWebView("SEARCH", text);
            }} 
          />
          <TouchableOpacity onPress={() => sendFilterToWebView("SEARCH", searchQuery)}>
            <Icon name="search" size={18} color="#000" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.optionalItems}>
          <TouchableOpacity>
            <Icon name="bus" size={18} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.filterText}>Show Transit Lines</Text>
          <Switch
            value={showTransit}
            onValueChange={(value) => {
              setShowTransit(value);
              sendFilterToWebView("TRANSIT", value);
            }}
          />
        </View>

        <View style={styles.optionalItems}>
          <TouchableOpacity>
            <Icon name="bicycle" size={18} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.filterText}>Show Bike Routes</Text>
          <Switch
            value={showBikes}
            onValueChange={(value) => {
              setShowBikes(value);
              sendFilterToWebView("BIKES", value);
            }}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logoContainerCentered: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, position: "absolute", left: 15 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#213E64", textAlign: "center", flex: 1 },
  headerIcons: { flexDirection: "row", gap: 15 },
  icon: { marginLeft: 10 },

  mapContainer: { flex: 2, margin: 10, borderRadius: 10, overflow: "hidden" },
  map: { width: "100%", height: "100%" },

  filters: { flex: 3, padding: 10 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  filterLabel: { fontSize: 16, color: "#000" },
  filterSearch: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, height: 40 },

  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  filterText: { fontSize: 16, color: "#000" },

  optionalItems: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navButton: { alignItems: "center" },
  navText: { fontSize: 12, color: "#000" },

  // 🔹 Added styles for job markers
  marker: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 10,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
    padding: 5,
    borderRadius: 10,
  },
  markerDot: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
  },
  markerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  noJobsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
  calloutContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  calloutText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#213E64",
    textAlign: "center",
  },
});
