import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
interface TaskCardProps {
  item: Task;
  onPress: (id: number) => void; // The onPress function accepts the task id
}

export function TaskCard({ item, onPress }: TaskCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.title}</Text>
      <TouchableOpacity
        style={item.checked ? styles.checkedButtton : styles.notCheckedButtton}
        onPress={() => onPress(item.id)}
      >
        <MaterialIcons name="check" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    color: "#333",
  },
  checkedButtton: {
    backgroundColor: "#1E3E62",
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  notCheckedButtton: {
    backgroundColor: "#808080",
    width: 30,
    height: 30,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
