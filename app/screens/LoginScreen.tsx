import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { validateEmail, validatePassword } from "./helper/validator";
import { apiPost } from "./helper/api_manager";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to save user data in AsyncStorage
  const saveUserData = async (userData: LoginResponse) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData)); // Save the user data as a string
      console.log("User data saved to AsyncStorage");
    } catch (error) {
      console.log("Error saving data to AsyncStorage:", error);
    }
  };

  const showAlert = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      showAlert("error", "Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      showAlert("error", "Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody: LoginRequest = { email, password };
      const response = await apiPost<LoginResponse>(
        "/users/login",
        requestBody
      );

      if (response.message === "Login successful") {
        showAlert("success", response.message || "Login successful.");
        saveUserData(response); // Save user data to AsyncStorage
        navigation.navigate("Home");
      } else {
        showAlert(
          "error",
          response.message || "An error occurred during login."
        );
      }
    } catch (error: any) {
      showAlert("error", error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Log in to your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.loginButton}
        disabled={isLoading}
      >
        <Text>{isLoading ? "Logging in..." : "Login"}</Text>
      </Button>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
      {/* Alert Modal */}
      <Modal
        transparent
        visible={alertVisible}
        animationType="fade"
        onRequestClose={() => setAlertVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setAlertVisible(false)}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.alertBox,
                alertType === "success"
                  ? styles.successAlert
                  : styles.errorAlert,
              ]}
            >
              <Text style={styles.alertText}>{alertMessage}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30, // Added padding for better scroll view
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#007BFF",
    marginBottom: 15,
  },
  loginButton: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#007BFF",
  },
  orText: {
    marginVertical: 10,
    color: "#666",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  registerText: {
    color: "#666",
  },
  registerLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertBox: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  successAlert: {
    backgroundColor: "#4CAF50",
  },
  errorAlert: {
    backgroundColor: "#F44336",
  },
  alertText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
