import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

const Login = ({ navigation,database,onLogin }) => {

  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async() => {
      if (!username || !password) {
        Alert.alert('Errore', 'Si prega di compilare tutti i campi');
        return;
      }
      const lowercaseUsername = username.toLowerCase();
      const checkCredenziali = await database.getAllAsync(`SELECT * FROM utente WHERE username = '${lowercaseUsername}' 
      and pwd = '${password}';`);
      console.log(checkCredenziali);
          if(checkCredenziali.length>0){
            onLogin(username);
            navigation.navigate('HomePage');
          }else {
            Alert.alert('Errore', 'Username o password non validi');}
    
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />
      <Button title="Accedi" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.label}>Non hai un account? Registrati qui.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEEC47',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'minions-font',
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
});

export default Login;
