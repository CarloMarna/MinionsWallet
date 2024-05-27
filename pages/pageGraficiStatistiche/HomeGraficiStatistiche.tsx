import * as React from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import * as Font from 'expo-font';
import Intervallo from './Intervallo';
import Media from './Media';
import SpesePerCategoria from './SpesePerCategoria';
import Grafici from './Grafici';

//CREAZIONE TAB NAVIGATOR
const TabTop = createMaterialTopTabNavigator();
const TabBottom = createBottomTabNavigator();

//FUNZIONE PER CARICARE FONT
async function loadFonts() {
  await Font.loadAsync({
    'fredoka-one': require('../../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
  });
}
loadFonts();

/************************* SCHERMATA STATISTICHE ********/
const HomeMediaMinMax = () => {
  return (
    <View style={styles.mainContainer}>
      <Intervallo />
      <Media />
    </View>
  );
};

/****************TAB BAR SUPERIORE**************/
const Statistiche = () => {
  return (
    <TabTop.Navigator>
      <TabTop.Screen name="Intervallo di Spesa" component={HomeMediaMinMax} />
      <TabTop.Screen name="Spese per Categoria" component={SpesePerCategoria} />
    </TabTop.Navigator>
  )
};

/************ TAB BAR INFERIORE ********** */

const HomeGraficiStatistiche = () => {
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
        }} component={Statistiche} />
        <TabBottom.Screen name="Grafici" options={{
          headerShown: false, tabBarIcon: ({ color, size }) => (
            <AntDesign name="barchart" size={size} color={color} />
          ),
        }} component={Grafici} />
      </TabBottom.Navigator>
    </SafeAreaView>
  );
}



/*********************** STILE PRIMA PAGINA ************************ */
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


});

export default HomeGraficiStatistiche;
