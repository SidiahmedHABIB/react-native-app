import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import { useState } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";

export default function AllTasksPage() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function openCamera() {
    setIsCameraOpen(true);
  }

  function closeCamera() {
    setIsCameraOpen(false);
  }

  return (
    <View style={styles.container}>
      {isCameraOpen ? (
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeCamera}>
              <Text style={styles.text}>Close</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <TouchableOpacity style={styles.openCameraButton} onPress={openCamera}>
          <Text style={styles.text}>Open Camera</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#1E3E62",
    paddingVertical: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  openCameraButton: {
    alignSelf: "center",
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
  },
});
