import { StatusBar } from "expo-status-bar";
import {
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import {
  addDoc,
  collection,
  db,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "./firebaseConfig";
import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [dob, setDoB] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const addData = async () => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        dob: dob,
        // born: 2000,
      });
      console.log("Document written with ID: ", docRef.id);
      getQueryData();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const getQueryData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const dataArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(dataArr);
    } catch (error) {
      console.error("Error getting documents: ", e);
    }
  };

  const deleteDocument = async (id) => {
    try {
      console.log(id);
      await deleteDoc(doc(db, "users", id));
      console.log("Document successfully deleted");
      setData(data.filter((item) => item.id !== id));
      // getQueryData();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (selectedItem) {
      try {
        const itemDoc = doc(db, "users", selectedItem.id);
        await updateDoc(itemDoc, {
          name: selectedItem.name,
          dob: selectedItem.dob, 
        });
        // Update the local state
        const updatedData = data.map(item => 
          item.id === selectedItem.id ? selectedItem : item
        );
        setData(updatedData);
        setModalVisible(false);
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    }
  };
 
  useEffect(() => {
    getQueryData();
    return () => getQueryData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={{ fontSize: 16, marginRight: 20 }}>
        Nama : {item.name} {item.dob}
      </Text> 
        <Button
          color={"green"}
          style={styles.itemButton}
          title="Edit"
          onPress={() => openEditModal(item)}
        />
        <Button
          color={"red"}
          style={styles.itemButton}
          title="Delete"
          onPress={() => deleteDocument(item.id)}
        /> 
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inlineContainer}>
        <Text style={styles.title}>Firestore : </Text>
        <TextInput
          style={styles.textInputStyle}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
        <TextInput
          style={styles.textInputStyle}
          value={dob}
          onChangeText={setDoB}
          placeholder="Date of Birth"
        />
        <TouchableOpacity style={styles.button} onPress={addData}>
          <Text style={styles.buttonTextColor}>Add</Text>
        </TouchableOpacity>
        <FlatList
          style={{ width: "100%" }}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalCard}>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Name"
            value={selectedItem?.name}
            onChangeText={(text) => setSelectedItem({ ...selectedItem, name: text })}
          />
          <TextInput
            style={styles.textInputStyle}
            placeholder="Date of Birth"
            value={selectedItem?.dob}
            onChangeText={(text) => setSelectedItem({ ...selectedItem, dob: text })}
          /> 
          <View style={styles.buttonContainer}>
            <Button title="Update" onPress={handleUpdate} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
          </View>
        </View>
      </Modal>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  inlineContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    marginTop: "10%",
  },
  textInputStyle: {
    borderWidth: 2,
    borderColor: "lightgrey",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    width: "100%",
    borderRadius: 5,
    marginVertical: "2%",
  },
  button: {
    backgroundColor: "blue",
    padding: "4%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonTextColor: {
    color: "white",
    fontSize: 16,
  },
  itemContainer: {
    marginVertical: 10,
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  itemButton: {  
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalCard:{
    backgroundColor:'white',
    width:'90%',
    padding:30,
    borderRadius:20
  }
});
