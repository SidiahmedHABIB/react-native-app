import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  GenerateResume: undefined;
  SearchJob: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
  const [user, setUser] = useState<LoginResponse | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user"); // Get user data from AsyncStorage
        if (savedUser) {
          setUser(JSON.parse(savedUser)); // Parse and set the user data
        }
      } catch (error) {
        console.error("Error loading user data from AsyncStorage", error);
      }
    };

    loadUser(); // Load the user data on component mount
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {user ? (
            <Text style={styles.welcomeText}>Hello, {user.fname}!</Text>
          ) : (
            <Text style={styles.welcomeText}>Welcome!</Text>
          )}
        </View>
        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Explore our powerful tools to help you build a professional resume
            and find your dream job. Start by generating your resume or
            searching for job opportunities today!
          </Text>
        </View>

        {/* Body */}
        <View style={styles.cardsContainer}>
          {/* Generate Resume Card */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("GenerateResume")}
          >
            <Image
              source={require("../../assets/images/resume-icon.webp")}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Generate</Text>
          </TouchableOpacity>

          {/* Search Job Card */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("SearchJob")}
          >
            <Image
              source={require("../../assets/images/job-search-icon.webp")}
              style={styles.cardImage}
            />
            <Text style={styles.cardText}>Search Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    padding: 20,
  },
  header: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  descriptionContainer: {
    marginVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  descriptionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  cardImage: {
    width: 90,
    height: 90,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
  },
});

export default HomeScreen;
