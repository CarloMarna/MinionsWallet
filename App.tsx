import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import NuovaSpesa from './pages/NuovaSpesa';  //importo pagina di aggiunta spesa
import HomeGraficiStatistiche from './pages/pageGraficiStatistiche/HomeGraficiStatistiche';
import Registration from './pages/Registration';
import HomePage from './pages/homePage/HomePage';
import Uscita from './pages/Uscita';
import { Ionicons } from '@expo/vector-icons'; // Assicurati di aver installato il pacchetto @expo/vector-icons
import Modal from 'react-native-modal';

const Stack = createStackNavigator();
const { width, height } = Dimensions.get('window');

/*
 <Stack.Screen name="NuovaSpesa" component={NuovaSpesa}/>
<Stack.Screen name="GraficiStatistiche" component={HomeGrfaiciStatistiche}/>

        */

/*<Stack.Screen name='Registration' component={Registration} options={{ headerShown: false }}/>*/

const App = ({ navigation }: { navigation: any }) => { //essendo app fuori da navigator, passo navigation come parametro
  const [isMenuVisible, setMenuVisible] = useState(false);
  const handleMenuClick = () => {
    setMenuVisible(!isMenuVisible);
  }
  const Menu = ({ navigation }) => {
    const handleMenuClickInternal = () => {
      setMenuVisible(!isMenuVisible);
    }
    return (
      <View>
        <Modal
          isVisible={isMenuVisible}
          animationIn="slideInLeft"
          animationOut="slideOutLeft"
          backdropOpacity={0.5}
          style={styles.modal}
          onBackdropPress={handleMenuClickInternal}>
          <View style={styles.menuContent}>
            <View style={styles.userRow}>
              <Image
                source={require('./assets/user/user-image.png')} // Imposta il percorso dell'immagine utente
                style={styles.userImage}
              />
              <Text style={styles.username}>Nome Correntista</Text>
            </View>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuVisible(false);
              navigation.navigate("HomePage")
            }}>
              <Text>DashBoard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuVisible(false);
              navigation.navigate("NuovaSpesa")
            }}>
              <Text>Nuova Spesa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuVisible(false);
              navigation.navigate("HomeGraficiStatistiche")
            }}>
              <Text>Grafici & Statistiche</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setMenuVisible(false);
              navigation.navigate("Uscita")
            }}>
              <Text>Uscita</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={() => {
              setMenuVisible(false);
              navigation.navigate("Registration")
            }}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
              <Text style={styles.footerText}>© {new Date().getFullYear()} Developed by MinionsGroup</Text>
              <Text style={styles.versionText}>v. 1.0.0.0</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Registration">
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={({ navigation }) => ({
            title: "DashBoard",
            headerLeft: () => (
              <View>
                <TouchableOpacity onPress={() => handleMenuClick()}>
                  <Ionicons name="menu-outline" size={24} color="black" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
                <Menu navigation={navigation} />
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="NuovaSpesa"
          component={NuovaSpesa}
          options={({ navigation }) => ({
            title: "Aggiungi Spesa",
            headerLeft: () => (
              <View>
                <TouchableOpacity onPress={() => handleMenuClick()}>
                  <Ionicons name="menu-outline" size={24} color="black" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
                <Menu navigation={navigation} />
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="HomeGraficiStatistiche"
          component={HomeGraficiStatistiche}
          options={({ navigation }) => ({
            title: "Statistiche",
            headerLeft: () => (
              <View>
                <TouchableOpacity onPress={() => handleMenuClick()}>
                  <Ionicons name="menu-outline" size={24} color="black" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
                <Menu navigation={navigation} />
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="Uscita"
          component={Uscita}
          options={({ navigation }) => ({
            headerLeft: () => (
              <View>
                <TouchableOpacity onPress={() => handleMenuClick()}>
                  <Ionicons name="menu-outline" size={24} color="black" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
                <Menu navigation={navigation} />
              </View>
            ),
          })}
        />

      </Stack.Navigator>
    </NavigationContainer >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'transparent', // Colore di sfondo per il modal
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContent: {
    backgroundColor: 'white',
    height: height,
    width: width * 4 / 5,
    padding: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }, logoutItem: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerText: {
    color: 'black',
    fontSize: 10
  },
  versionText: {
    color: 'black',
    fontSize: 10
  },
});

export default App;