import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import NuovaSpesa from './pages/NuovaSpesa';  //importo pagina di aggiunta spesa
import HomeGraficiStatistiche from './pages/pageGraficiStatistiche/HomeGraficiStatistiche';
import Registration from './pages/Registration';
import HomePage from './pages/homePage/HomePage';
import Uscita from './pages/Uscita';
import { Ionicons } from '@expo/vector-icons'; // Assicurati di aver installato il pacchetto @expo/vector-icons
import Modal from 'react-native-modal';
import useDatabase from './db/createDB';
import Login from './pages/Login';
import { getImageFromPath, getRandomImage } from './script/minionImage';

const Stack = createStackNavigator();
const { width, height } = Dimensions.get('window');


const Menu = ({ navigation, username, isMenuVisible, setMenuVisible, imageUser }) => {
  const handleMenuClickInternal = () => {
    setMenuVisible(!isMenuVisible);
  };

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
              source={imageUser} // Imposta il percorso dell'immagine utente
              style={styles.userImage}
            />
            <Text style={styles.username}>{username}</Text>
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
};


const App = () => {
  const database = useDatabase();
  const [idConto, setIdConto] = useState(0);
  const [username, setUsername] = useState('Non Sei Loggato');
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [imageUser, setImageUser] = useState(null);

  const takeIdConto = (idConto, username) => {
    setIdConto(idConto);
    setUsername(username);
  }

  useEffect(() => {
    setImageUser(getRandomImage());
  }, []);

  const handleMenuClick = () => {
    setMenuVisible(!isMenuVisible);
  }


<<<<<<< HEAD
  const Menu = ({ navigation, username }) => {
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
                source={imageUser} // Imposta il percorso dell'immagine utente
                style={styles.userImage}
              />
              <Text style={styles.username}>{username}</Text>
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

  const RegistrationScreen = (props) => <Registration {...props} database={database} onLogin={takeIdConto}/>;
=======
  const RegistrationScreen = (props) => <Registration {...props} database={database} />;
>>>>>>> 8611d563e012ed3bc8a6ce930d2fa5b90f0edfcf
  const LoginScreen = (props) => <Login {...props} database={database} onLogin={takeIdConto} />;
  const HomePageScreen = () => <HomePage database={database} idConto={idConto} />;
  const NuovaSpesaScreen = (props) => <NuovaSpesa {...props}  database={database} idConto={idConto} />;
  const HomeGraficiStatisticheScreen = () => <HomeGraficiStatistiche database={database} idConto={idConto} />;
  const UscitaScreen = (props) => <Uscita {...props} database={database} idConto={idConto} />;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Registration">
        <Stack.Screen
          name="Registration"
          options={{ headerShown: false }}
          component={RegistrationScreen}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePageScreen}
          options={({ navigation }) => ({
            title: "DashBoard",
            headerLeft: () => (
              <View>
                <TouchableOpacity onPress={() => handleMenuClick()}>
                  <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
                <Menu
                  navigation={navigation}
                  username={username}
                  isMenuVisible={isMenuVisible}
                  setMenuVisible={setMenuVisible}
                  imageUser={imageUser}
                />
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="NuovaSpesa"
          component={NuovaSpesaScreen}
          options={({ navigation }) => ({
            title: "Aggiungi Spesa",
            headerLeft: () => (
              <View>
                <TouchableOpacity onPress={() => handleMenuClick()}>
                  <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
                <Menu
                  navigation={navigation}
                  username={username}
                  isMenuVisible={isMenuVisible}
                  setMenuVisible={setMenuVisible}
                  imageUser={imageUser}
                />
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="HomeGraficiStatistiche"
          component={HomeGraficiStatisticheScreen}
          options={({ navigation }) => ({
            title: "Statistiche",
            headerLeft: () => (
              <View>
                <TouchableOpacity onPress={() => handleMenuClick()}>
                  <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
                <Menu
                  navigation={navigation}
                  username={username}
                  isMenuVisible={isMenuVisible}
                  setMenuVisible={setMenuVisible}
                  imageUser={imageUser}
                />
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="Uscita"
          component={UscitaScreen}
          options={({ navigation }) => ({
            headerLeft: () => (
              <View>
                <TouchableOpacity onPress={() => handleMenuClick()}>
                  <Ionicons name="menu-outline" size={30} color="black" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
                <Menu
                  navigation={navigation}
                  username={username}
                  isMenuVisible={isMenuVisible}
                  setMenuVisible={setMenuVisible}
                  imageUser={imageUser}
                />
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
  },
  logoutItem: {
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
