import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import * as Font from 'expo-font';
import Intervallo from './Intervallo';
import Media from './Media';
import SpesePerCategoria from './SpesePerCategoria';
import Grafici from './Grafici';

const TabTop = createMaterialTopTabNavigator();
const TabBottom = createBottomTabNavigator();

async function loadFonts() {
  await Font.loadAsync({
    'fredoka-one': require('../../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
  });
}

const HomeMediaMinMax = ({ database, idConto }:{database:any, idConto:number}) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.metaContainer}>
          <Intervallo database={database} idConto={idConto} />
        </View>
        <View style={styles.metaContainer}>
          <Media database={database} idConto={idConto} />
        </View>
      </View>
    </ScrollView>
  );
};

const Statistiche = ({ database, idConto }:{database:any, idConto:number}) => {
  return (
    <TabTop.Navigator>
      <TabTop.Screen name="Intervallo di Spesa">
        {() => <HomeMediaMinMax database={database} idConto={idConto} />}
      </TabTop.Screen>
      <TabTop.Screen name="Spese per Categoria" >
        {() => <SpesePerCategoria database={database} idConto={idConto} />}
      </TabTop.Screen>
    </TabTop.Navigator >
  )
};

const HomeGraficiStatistiche = ({ database, idConto }:{database:any, idConto:number}) => {
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
    <SafeAreaView style={styles.tabBarInferiori} >
      <TabBottom.Navigator >
        <TabBottom.Screen name="Statistiche" options={{
          headerShown: false, tabBarIcon: ({ color, size }) => (
            <AntDesign name="linechart" size={size} color={color} />
          ),
        }}>
          {() => <Statistiche database={database} idConto={idConto} />}
        </TabBottom.Screen>
        <TabBottom.Screen name="Grafici" options={{
          headerShown: false, tabBarIcon: ({ color, size }) => (
            <AntDesign name="barchart" size={size} color={color} />
          ),
        }}>
          {() => <Grafici database={database} idConto={idConto} />}
        </TabBottom.Screen>
      </TabBottom.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBarInferiori: {
    flex: 1,
    borderWidth: 1,
    borderTopColor: '#0057B8'
  },

  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FEEC47',
  },
  scrollContainer: {
    flexGrow: 1,
  },

  metaContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeGraficiStatistiche;
