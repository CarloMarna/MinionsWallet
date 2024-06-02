import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useRoute } from '@react-navigation/native';
async function loadFonts() {
  await Font.loadAsync({
    'minions-font': require('../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
  });
}
loadFonts();

const Registration = ({ navigation, database, onLogin }) => {


  
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [isDatabaseInitialized, setIsDatabaseInitialized] = useState(false);
  const handleGoToLogin = () => {  //reindirizzamento a login da modificare
    navigation.navigate("Login");

  }
  useEffect(() => {
    if (database) {
      setIsDatabaseInitialized(true);
    }
  }, [database]);

  const fetchCurrencies = async () => {
    if(isDatabaseInitialized){
    try {
      const result = await database.getAllAsync(`SELECT sigla, simbolo FROM valuta`);
      
      setCurrencies(result);
    } catch (error) {
      console.error("Errore durante il caricamento delle valute: ", error);
    }
  }};
  useEffect(() => {
    if (isDatabaseInitialized) {
      fetchCurrencies();
    }
  }, [isDatabaseInitialized]);


  const registrazioneUtente = async () => {
    let messaggio1 = '';
    let messaggio2 = '';
    try {
      const lowercaseUsername = username.toLowerCase();
      const lowercaseEmail = email.toLowerCase();
      const checkExistingUsername = await database.getAllAsync(`SELECT * FROM utente WHERE username = '${lowercaseUsername}';`);


      if (checkExistingUsername.length > 0) {

        return { messaggio: 'usernameDuplicato' };
      }
      else {


        const checkExistingEmail = await database.getAllAsync(`SELECT * FROM utente WHERE mail = '${lowercaseEmail}';`);


        if (checkExistingEmail.length > 0) {

          return { messaggio: 'emailDuplicato' };
        }
        else {

          const command1 = `INSERT INTO utente (username,mail,pwd) VALUES ('${lowercaseUsername}', '${lowercaseEmail}','${password}');`;
          const command2 = `INSERT INTO conto (nome_conto, sigla,username) VALUES ('${accountName}', '${selectedCurrency}','${lowercaseUsername}');`;

          await database.execAsync(command1);
          await database.execAsync(command2);
          
          const id_conto = await database.getFirstAsync(`SELECT id FROM conto WHERE username = '${lowercaseUsername}'`);
      
          onLogin(id_conto.id,lowercaseUsername);
          return {messaggio: ''};
        }

      }
    } catch (error) {
      console.error("Errore durante la registrazione: ", error);

      return { messaggio: 'errore' };
    }
  };
  
  const handleRegistration = async () => {
    //logica registrazione
    if (!username || !email || !password || !accountName) {
      Alert.alert('Errore', 'Si prega di compilare tutti i campi');
      return;

    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Errore', 'Inserire un indirizzo email valido');
      return;
    }
    const registrationResult = await registrazioneUtente();

    console.log(registrationResult);

    if (registrationResult.messaggio === 'usernameDuplicato') {
      Alert.alert(
        'Registrazione non eseguita',
        'Username già esistente',
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    } else if (registrationResult.messaggio === 'emailDuplicato') {

      Alert.alert(
        'Registrazione non eseguita',
        'Email già esistente',
        [
          {
            text: 'OK',
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    } else {

      Alert.alert(
        'Registrazione eseguita',
        'La registrazione è stata completata con successo!',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate("HomePage")
            },
            style: 'default',
          },
        ],
        { cancelable: false }
      );
    }
  };
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadApp() {
       
      await loadFonts();
      setFontLoaded(true);
    }
    loadApp();
  }, []);

  if (!fontLoaded) {
    return null;
  }
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Benvenuto in MINIONs</Text>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setUsername}
          value={username}
        />
        <Text style={styles.label}>Mail:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
        <Text style={styles.label}>NomeConto:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setAccountName}
          value={accountName}
        />
        <Text style={styles.label}>Valuta:</Text>
        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue, itemIndex) => setSelectedCurrency(itemValue)}
          style={styles.picker}
        >
          {currencies.map(currency => (
            <Picker.Item key={currency.sigla} label={`${currency.sigla} ${currency.simbolo}`} value={currency.sigla} />
          ))}
        </Picker>
        <Button title="Registrati" onPress={() => handleRegistration()} />
        <TouchableOpacity onPress={handleGoToLogin}>
          <Text style={styles.labelLog}>Se hai già un account clicca qui</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('HomePage')}>
          <Text style={styles.label}>Ti scocci di fare il login?Cliccami</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
export default Registration;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',



  },
  title: {
    fontSize: 24,
    fontFamily: 'minions-font',
    marginBottom: '20%',
    borderWidth: 2,
    borderColor: '#0057BB',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 40,
    color: '#0057BB',



  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#0057BB',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'left',
    width: '80%',
    fontFamily: 'minions-font',
  },
  picker: {

    marginTop: 10,
    borderColor: '#0057BB',

    borderWidth: 2,
    width: '90%',
    height: 40,
    textAlign: 'center',
    borderRadius: 6,
    backgroundColor: 'white',
    color: '#0057BB',
    marginBottom: 10,


  },
  labelLog: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'left',
    width: '80%',
    fontFamily: 'minions-font',
  },
});

