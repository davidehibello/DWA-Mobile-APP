import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  StatusBar,
  SafeAreaView,
  Platform,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import Sidebar from "./sideBar";

export default function Homepage({ navigation }) {
  const [activeFeature, setActiveFeature] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const features = [
    {
      id: 1,
      title: "Jobs Board",
      description: "Find the latest job postings in Durham",
      icon: "briefcase",
      image: require("./Jobboardimage.png"),
      screen: "JobBoard",
      color: "#4A90E2",
    },
    {
      id: 2,
      title: "Jobs Maps",
      description: "Discover jobs near you",
      icon: "map-marker",
      image: require("./Jobsmapimage.png"),
      screen: "JobMap",
      color: "#50C878",
    },
    {
      id: 3,
      title: "Career Explorer",
      description: "Explore potential career paths",
      icon: "compass",
      image: require("./Careerexplorerimage.png"),
      screen: "CareerExplorer",
      color: "#FF6B6B",
    },
    {
      id: 4,
      title: "Career Calculator",
      description: "Calculate potential earnings",
      icon: "calculator",
      image: require("./Careercalculatorimage.png"),
      color: "#FFD700",
    },
    {
      id: 5,
      title: "Resume Builder",
      description: "Create professional resumes",
      icon: "file-text-o",
      image: require("./Resumebuilderimage.png"),
      color: "#9370DB",
    },
    {
      id: 6,
      title: "Cover Letter",
      description: "Generate compelling cover letters",
      icon: "envelope-o",
      image: require("./Coverletterimage.png"),
      color: "#FF8C00",
    },
  ];

  // Create an array of animated values for each card
  const animatedValues = useRef(
    features.map(() => new Animated.Value(0))
  ).current;

  const scaleValues = useRef(features.map(() => new Animated.Value(1))).current;

  // Animate cards one by one
  useEffect(() => {
    const animations = features.map((_, index) =>
      Animated.timing(animatedValues[index], {
        toValue: 1,
        duration: 500, // Animation duration
        delay: index * 150, // Reduced delay for faster appearance
        useNativeDriver: true, // Use native driver for better performance
      })
    );

    // Start all animations
    Animated.stagger(150, animations).start();
  }, []);

  const handleCardPress = (feature, index) => {
    // Animate the card scale when pressed
    Animated.sequence([
      Animated.timing(scaleValues[index], {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValues[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveFeature(feature.id === activeFeature ? null : feature.id);

    // Navigate if screen is available
    if (feature.screen) {
      navigation.navigate(feature.screen);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.container}>

         {/* Sidebar Component */}
       {isSidebarOpen && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}


        {/* Header with Gradient */}
        <LinearGradient
          colors={["#213E64", "#356599"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.title}>Jobs First Durham</Text>
              <Text style={styles.subtitle}>
                Search & Career Development Tools
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.profileButton}  onPress={() => navigation.navigate("UserProfile")}>
                <Icon name="user-circle" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={toggleSidebar}>
                <Icon name="bars" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Functional Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon
              name="search"
              size={16}
              color="#8A8A8A"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for jobs, skills, or tools..."
              placeholderTextColor="#8A8A8A"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                style={styles.clearButton}
              >
                <Icon name="times-circle" size={16} color="#8A8A8A" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Feature Cards with Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Career Tools</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {features.map((feature, index) => {
            const cardStyle = {
              opacity: animatedValues[index], // Fade in
              transform: [
                {
                  translateY: animatedValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0], // Slide up from bottom
                  }),
                },
                {
                  scale: scaleValues[index], // Apply scale animation
                },
              ],
            };

            const isActive = activeFeature === feature.id;

            return (
              <Animated.View
                key={index}
                style={[
                  styles.card,
                  cardStyle,
                  { borderLeftColor: feature.color, borderLeftWidth: 4 },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleCardPress(feature, index)}
                  style={styles.cardContent}
                  activeOpacity={0.8}
                >
                  <Image source={feature.image} style={styles.cardImage} />
                  <View style={styles.cardTextContainer}>
                    <View style={styles.cardTitleRow}>
                      <Icon
                        name={feature.icon}
                        size={16}
                        color="#FFF"
                        style={styles.cardIcon}
                      />
                      <Text style={styles.cardTitle}>{feature.title}</Text>
                    </View>
                    <Text style={styles.cardDescription}>
                      {feature.description}
                    </Text>
                  </View>
                  <View style={styles.cardArrow}>
                    <Icon name="angle-right" size={20} color="#FFF" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* Added padding at the bottom for better scrolling */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  headerGradient: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E6FF",
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileButton: {
    padding: 8,
    marginRight: 12,
  },
  button: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#213E64",
    marginBottom: 4,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#213E64",
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  cardImage: {
    width: 120,
    height: 90,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardTextContainer: {
    flex: 1,
    paddingLeft: 16,
    paddingVertical: 12,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    marginRight: 6,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDescription: {
    color: "#E0E6FF",
    fontSize: 13,
    marginTop: 4,
  },
  cardArrow: {
    paddingLeft: 10,
  },
  bottomSpacer: {
    height: 20,
  },
});
