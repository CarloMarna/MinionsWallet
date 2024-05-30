import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SQLite from 'expo-sqlite';

//const dbPromise = SQLite.openDatabaseAsync('mio_database.db');

const HomePage = () => {
  const [result, setResult] = React.useState('');
  const saldoConto = 200;
  const valuta = '€';
  const [selectedValue, setSelectedValue] = React.useState("opzione1");

  /*React.useEffect(() => {
    async function prepareDB() {
      const db = await dbPromise;
      await db.execAsync('CREATE TABLE IF NOT EXISTS prova (matricola INTEGER PRIMARY KEY NOT NULL, nome TEXT, eta INTEGER, ruolo TEXT);');
    }
    prepareDB();
  }, []);

  const handleAddUser = async () => {
    try {
      const db = await dbPromise;
      //const matricola = 0;
      await db.execAsync(`INSERT INTO prova (matricola, nome, eta, ruolo) VALUES (78, 'pluto', 25, 'prova')`);
      //setResult(`Aggiunto Pluto con matricola: ${matricola}`);
    } catch (error) {
      console.log(error);
      setResult('Errore nell\'aggiungere Pluto.');
    }
  };

  const readUser = async () => {
    try {
      const db = await dbPromise;
      var results = await db.getAllAsync('SELECT * FROM utenti');
      for (const row of results) {
        console.log(row.matricola, row.nome, row.eta, row.ruolo);
        setResult("" + row.matricola + " " + row.nome + " " + row.eta + " " + row.ruolo);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const readUserDB = async () => {
    try {
      const db = await dbPromise;
      await db.execAsync(`DELETE FROM utenti`);
      console.log("funzion nda fess e mammt");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button title="Aggiungi Pluto" onPress={handleAddUser} />
        <Button title="Fai una select" onPress={readUser} />
        <Button title="Svuota db" onPress={readUserDB} />
        <Text style={styles.resultText}>{result}</Text>
      </View>
    </SafeAreaView>
  );*/

  const [currentTodo, setCurrentTodo] = React.useState<string>('');
  const [todos, setTodos] = React.useState<TodoType[]>([]);
  
  const renderTodo = ({item}: {item: TodoType}) => {
    return (
      <View style={styles.todoView}>
        <Text style={styles.todoText}>{item.todo}</Text>
        <Button
          title="Fatto"
          onPress={() => {
            const updateTodos = [...todos];
            updateTodos.splice(updateTodos.findIndex((e) => e.id == item.id), 1);
            setTodos(updateTodos);
          }}
        />
      </View>
    )
  }

  return (
    <SafeAreaView >
      <ScrollView nestedScrollEnabled style={styles.container}>
        <View style={styles.containerSaldoConto}>
          <View style={styles.cerchioEsterno}>
            <View style={styles.cerchioInterno}>
              <Text style={styles.testo}>Saldo Conto {saldoConto + valuta}</Text>
            </View>
          </View>
        </View>
        <View style={styles.containerVisualizzaElementi}>
          <View style={styles.visualizzaElementi}>
            <View style={styles.viewPicker}>
              <Picker
                selectedValue={selectedValue}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
              >
                <Picker.Item label="10" value="10" />
                <Picker.Item label="25" value="25" />
                <Picker.Item label="50" value="50" />
                <Picker.Item label="100" value="100" />
              </Picker>
            </View>
            <View style={styles.spaceBtnChsEl} />
            <TouchableOpacity style={styles.nuovaSpesaBtn}>
              <Text style={styles.nuovaSpesaBtnText}>Nuova Spesa</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.containerListaSpese}>
          <View style={styles.rigaSpesa}>
            <View style={styles.categoriaSpesa}>

            </View>
            <View style={styles.descrizioneSpesa}>
              <View style={styles.testoDescrizioneSpesa}>

              </View>
              <View style={styles.dataDescrizioneSpesa}>

              </View>
            </View>
            <View style={styles.importoSpesa}>

            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    /*flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,*/
    backgroundColor: 'white'
  },
  containerSaldoConto: {
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 45
  },
  cerchioEsterno: {
    width: 200, // larghezza del cerchio
    height: 120, // altezza del cerchio
    borderRadius: 75, // metà della larghezza e altezza per ottenere un cerchio
    backgroundColor: '#4CAF50', // colore di sfondo del cerchio
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black'
  },
  cerchioInterno: {
    width: 140, // larghezza del cerchio
    height: 100, // altezza del cerchio
    borderRadius: 50, // metà della larghezza e altezza per ottenere un cerchio
    backgroundColor: 'white', // colore di sfondo del cerchio
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black'
  },
  testo: {
    color: 'black', // colore del testo
    fontSize: 18, // dimensione del testo
    fontWeight: 'bold',
    textAlign: 'center'
  },
  containerVisualizzaElementi: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'black'
  },
  visualizzaElementi: {
    flexDirection: 'row',
  },
  spaceBtnChsEl: {
    width: 100,
  },
  viewPicker: {
    height: 50,
    borderWidth: 3,
    borderColor: 'black'
  },
  picker: {
    height: 50,
    width: 100
  },
  nuovaSpesaBtn: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  nuovaSpesaBtnText: {
    color: 'white',
    textAlign: 'center',
  }
});

export default HomePage;