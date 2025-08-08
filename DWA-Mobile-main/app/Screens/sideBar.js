import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Animated,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigation = useNavigation();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(350)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : 350,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const handleSignOut = () => {
    setShowSignOutModal(false);
    toggleSidebar();
    navigation.replace("Login");
  };

  return (
    <View style={styles.overlayContainer}>
      {/* Sign Out Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSignOutModal}
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons 
              name="log-out-outline" 
              size={40} 
              color="#D32F2F" 
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}> Confirm Sign Out</Text>
            <Text style={styles.modalText}>
              Are you sure you want to sign out?
            </Text>
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSignOutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSignOut}
              >
                <Text style={styles.confirmButtonText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sidebar Overlay */}
      {isOpen && (
        <TouchableOpacity 
          onPress={toggleSidebar} 
          style={styles.overlay}
          activeOpacity={1}
        />
      )}

      {/* Sidebar Content */}
      <Animated.View 
        style={[
          styles.sidebar, 
          { 
            transform: [{ translateX: slideAnim }],
            shadowOpacity: isOpen ? 0.2 : 0 
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={toggleSidebar}
        >
          <Ionicons name="close" size={28} color="#666" />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <TouchableOpacity 
            onPress={() => {
              navigation.navigate("UserProfile");
              toggleSidebar();
            }}
            style={styles.profileTouchable}  // Added this style
          >
            <View style={styles.profileContent}>  
            <View style={styles.profileImageContainer}>
              <Image 
                source={require("./profile-image.png")} 
                style={styles.profileImage} 
              />
            </View>
            <View style={styles.profileTextContainer}> 
            <Text style={[styles.profileName, { textAlign: 'left' }]}>John Doe</Text>
            <Text style={[styles.profileEmail, { textAlign: 'left' }]}>john.doe@example.com</Text>
            </View>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuScrollContainer}>
          {/* Menu Items */}
          <MenuButton
            icon="library-outline"
            label="Jobs First Career Library"
            color="#213E64"
            onPress={() => Linking.openURL("https://durhamworkforceauthority.ca/jobs-first-durham/jobs-first-career-library/")}
          />
          
          <MenuButton
            icon="help-circle-outline"
            label="Jobs First Durham FAQs"
            color="#213E64"
            onPress={() => Linking.openURL("https://durhamworkforceauthority.ca/jobs-first-durham/jfd-faqs/")}
          />
          
          <MenuButton
            icon="videocam-outline"
            label="LMI Video Series"
            color="#213E64"
            onPress={() => Linking.openURL("https://durhamworkforceauthority.ca/jobs-first-durham/lmi-video-series/")}
          />
          
          <MenuButton
            icon="people-outline"
            label="Child Care Resources" 
            color="#213E64"
            onPress={() => Linking.openURL("https://durhamworkforceauthority.ca/jobs-first-durham/durham-region-child-care-sector-resource-page/")}
          />
          
          <MenuButton
            icon="document-text-outline"
            label="Labor Market Request"
            color="#213E64"
            onPress={() => Linking.openURL("https://durhamworkforceauthority.ca/jobs-first-durham/labour-market-request-form/")}
          />

          <View style={styles.divider} />

          <MenuButton
            icon="settings-outline"
            label="Settings"
            color="#213E64"
            onPress={() => {
              navigation.navigate("Settings");
              toggleSidebar();
            }}
          />

          <MenuButton
            icon="log-out-outline"
            label="Sign Out"
            color="#D32F2F"
            onPress={() => setShowSignOutModal(true)}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

// Reusable Menu Button Component
const MenuButton = ({ icon, label, onPress, color = "#2B5CC3" }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons name={icon} size={22} color={color} />
    <Text style={[styles.menuText, color === "#D32F2F" && { color }]}>
      {label}
    </Text>
    {color !== "#D32F2F" && (
      <Ionicons name="chevron-forward" size={18} color="#999" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  // Overlay and Sidebar Styles
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 200,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 320,
    height: "100%",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 0 },
    shadowRadius: 10,
    elevation: 20,
    zIndex: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    padding: 10,
  },

  // Profile Section
  profileSection: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  profileTouchable: {
    width: '100%',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
  },

  // Menu Items
  menuScrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 25,
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#213E64',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: '#666',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: '#213E64',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});

export default Sidebar;