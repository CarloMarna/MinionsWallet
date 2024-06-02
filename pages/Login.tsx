import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

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
    console.log(checkCredenziali);
    if (checkCredenziali.length > 0) {
      const id_conto = await database.getFirstAsync(`SELECT id FROM conto WHERE username = '${lowercaseUsername}'`);
      
      onLogin(id_conto.id, lowercaseUsername);
      navigation.navigate('HomePage');
    } else {
      Alert.alert('Errore', 'Username o password non validi');
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FEEC47',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontFamily: 'minions-font',
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'center',
    borderColor: '#0057BB',
    borderWidth: 2,
    borderRadius: 10,
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
    marginTop: 20,
    color: '#0057BB',
    fontFamily: 'minions-font',
  },
});

export default Login;