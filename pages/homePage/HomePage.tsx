import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  View,
  Text,
  ScrollView,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

//const dbPromise = SQLite.openDatabaseAsync('mio_database.db');

const HomePage = () => {
  const [result, setResult] = React.useState('');

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

  return (
    <ScrollView>
      <View style={styles.cerchioEsterno}>
        <View style={styles.cerchioInterno}>
          <Text style={styles.testo}>saldo conto</Text>
        </View>
      </View>
    </ScrollView>
  );




};

const styles = StyleSheet.create({
  /*container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    marginTop: 20,
  },*/
  cerchioEsterno: {
    width: 150, // larghezza del cerchio
    height: 150, // altezza del cerchio
    borderRadius: 75, // metà della larghezza e altezza per ottenere un cerchio
    backgroundColor: '#4CAF50', // colore di sfondo del cerchio
    justifyContent: 'center',
    alignItems: 'center',
  },
  cerchioInterno: {
    width: 150, // larghezza del cerchio
    height: 150, // altezza del cerchio
    borderRadius: 75, // metà della larghezza e altezza per ottenere un cerchio
    backgroundColor: '#4CAF50', // colore di sfondo del cerchio
    justifyContent: 'center',
    alignItems: 'center',
  },
  testo: {
    color: '#fff', // colore del testo
    fontSize: 18, // dimensione del testo
    fontWeight: 'bold',
  },
});

export default HomePage;
