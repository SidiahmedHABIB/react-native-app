import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { validateEmail, validatePassword } from "./helper/validator";
import { apiPost } from "./helper/api_manager";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add isLoading state

  const showAlert = (type: "success" | "error", message: string) => {
    setAlertType(type);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleRegister = async () => {
    if (!fname || !lname || !email || !password) {
      showAlert("error", "Please fill in all fields.");
      return;
    }
    if (!validateEmail(email)) {
      showAlert("error", "Please enter a valid email address.");
      return;
    }
    if (!validatePassword(password)) {
      showAlert("error", "Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true); // Set loading to true before the API request

    const requestBody: RegisterRequest = {
      fname,
      lname,
      email,
      password,
    };
    try {
      const response = await apiPost<RegisterResponse>(
        "/users/register",
        requestBody
      );

      if (response.message === "User registered successfully") {
        showAlert("success", response.message || "Registration successful!");
        navigation.navigate("Login");
      } else {
        showAlert(
          "error",
          response.message || "An error occurred during register."
        );
      }
    } catch (error: any) {
      showAlert("error", error.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false); // Set loading to false after the API request
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <Image
        source={require("../../assets/images/icon.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started!</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#888"
        value={fname}
        onChangeText={setFname}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#888"
        value={lname}
        onChangeText={setLname}
      />
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
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        style={styles.registerButton}
        disabled={isLoading} // Disable button when loading
      >
        <Text> {isLoading ? "Registering..." : "Register"}</Text>
      </Button>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginLink}> Log in</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
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
    borderWidth: 1,
    borderColor: "#ddd",
  },
  registerButton: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#007BFF",
  },
  loginContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
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
