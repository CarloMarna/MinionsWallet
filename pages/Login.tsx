import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert,ScrollView, SafeAreaView } from 'react-native';

const Login = ({ navigation, database, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Errore', 'Si prega di compilare tutti i campi');
      return;
    }
    const lowercaseUsername = username.toLowerCase();
    const checkCredenziali = await database.getAllAsync(
      `SELECT * FROM utente WHERE username = '${lowercaseUsername}' and pwd = '${password}';`
    );
    if (checkCredenziali.length > 0) {
      const id_conto = await database.getFirstAsync(`SELECT id FROM conto WHERE username = '${lowercaseUsername}'`);
      
      onLogin(id_conto.id, lowercaseUsername);
      navigation.navigate('HomePage');
    } else {
      Alert.alert('Errore', 'Username o password non validi');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <Text style={styles.title}>Accedi</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username:</Text>
        <TextInput style={styles.input} onChangeText={setUsername} value={username} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>Accedi</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.registerText}>Non hai un account? Registrati qui.</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};
export default Login;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
   
    
    backgroundColor: '#FFF9C4',
    padding: 20,
    shadowOpacity: 0.25, 
    shadowRadius: 3.84,
    elevation: 5, 
  },
  title: {
    
    
    marginTop: 40,
    fontSize: 24,
    fontFamily: 'minions-font',
    marginBottom: 60,
    borderWidth: 2,
    borderColor: '#0057BB',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 40,
    textAlign: 'center',
    color: '#0057BB',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#0057BB',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'minions-font',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#0057BB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'minions-font',
    fontWeight: 'bold',
  },
  registerText: {
    fontSize: 16,
    marginTop: '20%',
    color: '#0057BB',
    fontFamily: 'minions-font',
    
  },
});