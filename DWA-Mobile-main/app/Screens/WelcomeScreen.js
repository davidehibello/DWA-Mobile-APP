import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Easing,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Parallel animations
    Animated.parallel([
      // Pulse animation for arrow
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            easing: Easing.elastic(1.2),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.elastic(1.2),
            useNativeDriver: true,
          }),
        ])
      ),
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Slide up animation
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated logo container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <Image
          source={require("./DWA-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Decorative elements */}
        <View style={styles.decorativeCircle} />
        <View style={[styles.decorativeCircle, styles.circle2]} />
      </Animated.View>

      {/* Bottom content */}
      <Animated.View
        style={[
          styles.bottomContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          },
        ]}
      >
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.subtitle}>to Jobs First Durham</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("onboardingOne")}
          activeOpacity={0.7}
        >
          <Animated.View
            style={[
              styles.arrowContainer,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: "rgba(100, 154, 71, 0.1)",
                borderRadius: 50,
                padding: 10,
              },
            ]}
          >
            <Icon name="arrow-right" size={50} color="#649A47" />
          </Animated.View>
        </TouchableOpacity>

        <Text style={styles.hintText}>Tap to continue</Text>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fff8",
  },
  logoContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    width: width * 0.7,
    height: 150,
    zIndex: 2,
  },
  decorativeCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(100, 154, 71, 0.08)",
    zIndex: 1,
  },
  circle2: {
    width: 150,
    height: 150,
    top: "30%",
    left: "20%",
    backgroundColor: "rgba(100, 154, 71, 0.05)",
  },
  bottomContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: height * 0.1,
  },
  welcomeText: {
    color: "#649A47",
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    color: "#7dab60",
    fontSize: 18,
    marginBottom: 30,
    fontWeight: "500",
  },
  arrowContainer: {
    marginTop: 20,
  },
  hintText: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 20,
    fontStyle: "italic",
  },
});
