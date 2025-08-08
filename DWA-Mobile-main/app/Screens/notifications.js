import React from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView,
  Image,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';

const notifications = [
  {
    id: "1",
    type: "info",
    message: "New job available: Web Developer",
    time: "2h ago",
    read: false
  },
  {
    id: "2",
    type: "success",
    message: "Job successfully saved: UX Designer",
    time: "3h ago",
    read: true
  },
  {
    id: "3",
    type: "info",
    message: "New job available: Data Analyst",
    time: "5h ago",
    read: false
  },
  {
    id: "4",
    type: "success",
    message: "Job successfully saved: Marketing Coordinator",
    time: "1d ago",
    read: true
  },
  {
    id: "5",
    type: "success",
    message: "Your saved job 'Product Manager at InnovateCo' has been updated",
    time: "2d ago",
    read: true
  },
  {
    id: "6",
    type: "alert",
    message: "Complete your profile to get 30% more job matches",
    time: "1w ago",
    read: true
  },
  {
    id: "7",
    type: "info",
    message: "5 new Data Analyst positions matching your skills",
    time: "1w ago",
    read: true
  },
  {
    id: "8",
    type: "info",
    message: "New featured job: Mobile App Developer at AppWorks",
    time: "2w ago",
    read: false
  },

];

const Notification = ({ navigation }) => {
  const renderItem = ({ item }) => {
    const icon = item.type === "success" ? "check-circle" : "info-circle";
    const iconColor = item.type === "success" ? "#4CAF50" : "#2196F3";
    const cardStyle = item.read ? styles.card : [styles.card, styles.unreadCard];

    return (
      <TouchableOpacity 
        style={cardStyle}
        activeOpacity={0.7}
      >
        <Icon name={icon} size={22} color={iconColor} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>{item.time}</Text>
        </View>
        {!item.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="search" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bars" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Notification List */}
      <View style={styles.content}>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="bell-slash" size={40} color="#ccc" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

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
  content: {
    flex: 1,
    padding: 15,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 90, // Fixed height for all cards
    overflow: 'hidden', // Ensures content doesn't overflow
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#213E64",
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', // Vertically center the text
    height: '100%', // Take full height of parent
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 13,
    color: "#888",
    marginTop: 4, // Add some space between message and timestamp
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#213E64",
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
});

export default Notification;