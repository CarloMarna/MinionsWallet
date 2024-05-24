import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
const dbPromise = SQLite.openDatabase({name: 'minionswallet.db', location: 'default'});


const HomePage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [result, setResult] = React.useState('');
  
  const readUser = async () => {
    try {
      const db = await dbPromise;
      console.log("ciao");
      var results = await db.executeSql('SELECT * FROM utente WHERE username = "petto"');
      console.log(results);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>Contenuto del popup</Text>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Text>Chiudi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="menu-outline" size={24} color="black" style={{ marginLeft: 15 }} />
      </TouchableOpacity>

      <Button title="Fai una select" onPress={readUser} />
        <Text>{result}</Text>
    </View>
  );
};

export default HomePage;
