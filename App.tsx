import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import NuovaSpesa from './pages/NuovaSpesa';  //importo pagina di aggiunta spesa
import HomeGraficiStatistiche from './pages/pageGraficiStatistiche/HomeGraficiStatistiche';
import Registration from './pages/Registration';
import HomePage from './pages/homePage/HomePage';
import Uscita from './pages/Uscita';
import { Ionicons } from '@expo/vector-icons'; // Assicurati di aver installato il pacchetto @expo/vector-icons

const Stack = createStackNavigator();


/*
 <Stack.Screen name="NuovaSpesa" component={NuovaSpesa}/>
<Stack.Screen name="GraficiStatistiche" component={HomeGrfaiciStatistiche}/>

        */

/*<Stack.Screen name='Registration' component={Registration} options={{ headerShown: false }}/>*/
function App({ navigation }) { //essendo app fuori da navigator, passo navigation come parametro


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Registration">
        <Stack.Screen name="Registration" options={{ headerShown: false }} component={Registration} />
        <Stack.Screen name="NuovaSpesa" component={NuovaSpesa} />
        <Stack.Screen name="HomeGraficiStatistiche" component={HomeGraficiStatistiche} options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('Uscita')}
              title="Menu"
              color="#000"
            />
          ),
        })}
        />
        <Stack.Screen name="Uscita" component={Uscita} options={({ navigation }) => ({
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('Uscita')}
              title="Menu"
              color="#000"
            />
          ),
        })}
        />
      </Stack.Navigator>
    </NavigationContainer>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;