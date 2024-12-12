import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  Alert,
} from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { HelloWave } from "@/components/HelloWave";
import { TaskCard } from "@/components/TaskCard";

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "task 1", checked: true },
    { id: 2, title: "Finish React Native project", checked: false },
    { id: 3, title: "Call sda", checked: true },
    { id: 4, title: "react native", checked: false },
  ]);

  const handleCheckedTask = (taskId: number) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, checked: !task.checked } : task
      )
    );
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [ischecked, setIschecked] = useState();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const username = "Sidi Ahmed";

  const addTask = () => {
    if (newTaskTitle.trim() === "") {
      Alert.alert("Error", "Task title cannot be empty.");
      return;
    }

    const newTask: Task = {
      id: tasks.length + 1,
      title: newTaskTitle,
      checked: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setModalVisible(false); // Close the dialog after adding task
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Hi, {username}! <HelloWave />
        </Text>
      </View>

      {/* Title of Tasks  */}
      <View style={styles.listeTitle}>
        <Text style={styles.listeTitleText}>Tasks</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.listeTitleTextButton}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks.filter((t) => !t.checked)}
        renderItem={({ item }) => (
          <TaskCard item={item} onPress={handleCheckedTask} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.taskList}
      />

      {/* Title of Tasks Done  */}
      <View style={styles.listeTitle}>
        <Text style={styles.listeTitleText}>Done Tasks</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.listeTitleTextButton}>See All</Text>
        </TouchableOpacity>
      </View>
      {/* Task List */}
      <FlatList
        data={tasks.filter((t) => t.checked == true)}
        renderItem={({ item }) => (
          <TaskCard item={item} onPress={handleCheckedTask} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.taskList}
      />
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Task Creation Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Task</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter task title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <View style={styles.modalButtons}>
              <Button title="Add Task" onPress={addTask} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  refreshButton: {
    backgroundColor: "#1E3E62",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    margin: 10,
  },
  refreshButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    padding: 20,
    backgroundColor: "#1E3E62",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    color: "#FFF",
    fontWeight: "bold",
  },
  taskList: {
    padding: 20,
  },
  listeTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listeTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 10,
  },
  listeTitleTextButton: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 20,
    marginTop: 10,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#1E3E62",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
