import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
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

const Registration = ({ navigation, database }) => {

  console.log(database);

  const currencies = ["EUR", "USD", "JPY", "GBP", "AUD", "CAD",
    "CHF", "CNY", "SEK", "NZD", "INR", "RUB", "KRW", "MXN",
    "BRL", "ZAR", "THB", "SAR", "TRY", "AED"];


  function currencySymbols(currencyCode: string) {
    switch (currencyCode) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'JPY':
        return '¥';
      case 'CAD':
        return '$';
      case 'AUD':
        return '$';
      case 'CHF':
        return 'CHF';
      case 'CNY':
        return '¥';
      case 'SEK':
        return 'kr';
      case 'NZD':
        return '$';
      case 'INR':
        return '₹';
      case 'RUB':
        return '₽';
      case 'KRW':
        return '₩';
      case 'MXN':
        return '$';
      case 'BRL':
        return 'R$';
      case 'ZAR':
        return 'R';
      case 'THB':
        return '฿';
      case 'SAR':
        return '﷼';
      case 'TRY':
        return '₺';
      case 'AED':
        return 'د.إ';
      default:
        return '';
    }

  }
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const handleGoToLogin = () => {  //reindirizzamento a login da modificare
    Alert.alert(
      'Reindirizzamento alla pagina di Login',
      '',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate("Uscita")
          },
          style: 'default',
        },
      ],
      { cancelable: false }
    );

  }

  const registrazioneUtente = async (database: any, accountName: any, selectedCurrency: any) => {
    const messaggio = '';
    try {
      const command = `INSERT INTO conto (nome_conto, sigla) VALUES ('${accountName}', '${selectedCurrency}');`;
      await database.execAsync(command);
      return { messaggio: 'tutto ok' };
    } catch (error) {
      console.error("Errore durante la registrazione: ", error);

      return { messaggio: 'errore' };
    }
  };
  /*`INSERT INTO conto (nome_conto, sigla) VALUES 
                ('Conto Corrente', 'EUR'),
                ('Conto Risparmio', 'USD');` */
  const handleRegistration = () => {
    //logica registrazione
    if (!username || !email || !password || !accountName) {
      Alert.alert('Errore', 'Si prega di compilare tutti i campi');
      return;
    }
    const registrationResult = registrazioneUtente(database, accountName, selectedCurrency);
    console.log(registrationResult);
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
          <Picker.Item key={currency} label={`${currency} ${currencySymbols(currency)}`} value={currency} />
        ))}
      </Picker>
      <Button title="Registrati" onPress={handleRegistration} />
      <TouchableOpacity onPress={handleGoToLogin}>
        <Text style={styles.labelLog}>Se hai già un account clicca qui</Text>
      </TouchableOpacity>
    </View>
  );
}
export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEEC47',



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

