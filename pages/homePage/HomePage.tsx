import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';

//import * as SQLite from 'expo-sqlite';


const { width, height } = Dimensions.get('window');

//const dbPromise = SQLite.openDatabaseAsync('mio_database.db');

interface Spesa {
  id: string;
  descrizione: string;
  data: string;
  importo: string;
  categoria: string;
}

interface Categoria {
  nome: string;
  path: string;
}

const truncateText = (text: string, length: number = 30) => {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};


const HomePage = () => {
  const [selectedValue, setSelectedValue] = React.useState("10");
  const [saldoConto, setSaldoConto] = React.useState(600);
  const [valuta, setValuta] = React.useState("€");
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [spesaModalVisible, setSpesaModalVisible] = React.useState<boolean>(false);
  const [selectedSpesa, setSelectedSpesa] = React.useState<Spesa | null>(null);
  const [spese, setSpese] = React.useState([
    { id: '1', descrizione: 'Pagamento Bonifico Istantaneo', data: '27/05/2023', importo: '-300€' },
    { id: '2', descrizione: 'Acquisto Negozio', data: '28/05/2023', importo: '-50€' },
    { id: '3', descrizione: 'Pagamento Affitto', data: '29/05/2023', importo: '-500€' },
    { id: '4', descrizione: 'Pagamento Bonifico Istantaneodsb fmns fmnds nfbdsmnfb sdnmbf dsb fndsbf bdskfb hds', data: '27/05/2023', importo: '-300€' },
    { id: '5', descrizione: 'Acquisto Negozio', data: '28/05/2023', importo: '-50€' },
    { id: '6', descrizione: 'Pagamento Affitto', data: '29/05/2023', importo: '-500€' },
    { id: '7', descrizione: 'Pagamento Bonifico Istantaneodsb fmns fmnds nfbdsmnfb sdnmbf dsb fndsbf bdskfb hds', data: '27/05/2023', importo: '-300€' },
    { id: '8', descrizione: 'Acquisto Negozio', data: '28/05/2023', importo: '-50€' },
    { id: '9', descrizione: 'Pagamento Affitto', data: '29/05/2023', importo: '-500€' }
  ]);
  const today = new Date();

  const [data, setData] = React.useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [viewDataPicker, setViewDataPicker] = React.useState(false);
  const [causale, setCausale] = React.useState('');
  const [categoria, setCategoria] = React.useState('');
  const [importo, setImporto] = React.useState('');


  const aggiungiSpesa = () => {
    console.log("Causale:", causale);
    console.log("Categoria:", categoria);
    console.log("Importo:", importo);
    console.log("Data:", data.toLocaleDateString());
  };

  const openNuovaSpesa = () => {
    setSpesaModalVisible(true);
  };
  const closeSpesaModal = () => {
    setSpesaModalVisible(false);
  };
  const openRiepilogoSpesa = (spesa: Spesa) => {
    setSelectedSpesa(spesa);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const textInputRef = React.useRef(null);

  const handleViewPress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const renderSpese = ({ item }: { item: Spesa }) => {
    return (
      <TouchableOpacity onPress={() => openRiepilogoSpesa(item)}>
        <View style={styles.rigaSpesa}>
          <View style={styles.categoriaSpesa}>
            <Ionicons name='add-circle-outline' size={35} color='#0057BB'></Ionicons>
          </View>
          <View style={styles.descrizioneSpesa}>
            <View style={styles.testoDescrizioneSpesa}>
              <Text>{truncateText(item.descrizione)}</Text>
            </View>
            <View style={styles.dataDescrizioneSpesa}>
              <Text>{item.data}</Text>
            </View>
          </View>
          <View style={styles.importoSpesa}>
            <Text style={styles.testoImportoSpesa}>{item.importo}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerSaldoConto}>
        <Image source={require('../../assets/img/icone_minions/Minion-Kungfu.png')}/>
        <View style={styles.cerchioEsterno}>
          <Text style={[styles.testo, { paddingLeft: 5 }]}><Ionicons size={25} name="wallet-outline" />{"  " + saldoConto + " " + valuta}</Text>
          <Text style={[{ paddingLeft: 5, fontSize: 13 }]}>Saldo disponibile al {today.toLocaleDateString()}</Text>
          <View style={{ position: 'absolute', bottom: 10, right: 7 }}>
            <TouchableOpacity>
              <Text> Aggiungi Fondi <Ionicons name="caret-forward-outline" /></Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.containerVisualizzaElementi}>
        <View style={styles.visualizzaElementi}>
          <View style={styles.viewPicker}>
            <Picker
              selectedValue={selectedValue}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="10" value="10" />
              <Picker.Item label="25" value="25" />
              <Picker.Item label="50" value="50" />
              <Picker.Item label="100" value="100" />
            </Picker>
          </View>
          <View style={styles.spaceBtnChsEl} />
          <TouchableOpacity style={styles.nuovaSpesaBtn} onPress={() => openNuovaSpesa()}>
            <Text style={styles.nuovaSpesaBtnText}>Nuova Spesa</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={spesaModalVisible}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        backdropOpacity={0.5}
        onBackdropPress={closeSpesaModal}
        style={styles.modalNuovaSpesaContainer} // Aggiungi questo stile
      >
        <ScrollView contentContainerStyle={styles.modalViewNuovaSpesa}>
          <View style={styles.modalNuovaSpesaHeader}>
            <Text style={styles.titleNuovaSpesaHeader}>Inserisci Nuova Spesa</Text>
            <View style={styles.modalViewSpaceSeparator}></View>
            <Ionicons name="close-circle-outline" size={30} color={'#cc0000'} onPress={closeSpesaModal}></Ionicons>
          </View>
          <Text style={styles.labelNuovaSpesa}>Inserire la causale :</Text>
          <TouchableOpacity style={styles.nuovaSpesaCausale} onPress={handleViewPress}>
            <TextInput
              ref={textInputRef}
              multiline={true}
              style={[{ paddingTop: 5 }]}
              onChangeText={(text) => setCausale(text)}
            />
          </TouchableOpacity>
          <View style={styles.nuovaSpesaCategoriaData}>
            <View style={styles.viewInputNuovaSpesa}>
              <Text style={styles.labelNuovaSpesa}>Categoria :</Text>
              <TextInput style={styles.inputNuovaSpesa} onChangeText={(text) => setCategoria(text)}></TextInput>
            </View>
            <View style={styles.modalViewSpaceSeparator} />
            <View style={styles.viewInputNuovaSpesa}>
              <Text style={styles.labelNuovaSpesa}>Data :</Text>
              <TouchableOpacity onPress={() => { setViewDataPicker(true) }}>
                <View style={[{ flexDirection: 'row' }]}>
                  <Ionicons name='calendar-outline' color={'#0057BB'} size={25} />
                  <TextInput editable={false} style={[styles.inputNuovaSpesa, { width: 115, color: 'black' }]}>{data.toLocaleDateString()}</TextInput>
                </View>
              </TouchableOpacity>
              {viewDataPicker &&
                <DateTimePicker
                  mode='date'
                  display='calendar'
                  value={data}
                  onChange={(event, date) => {
                    setData(
                      new Date(date.getFullYear(),
                        date.getMonth(), date.getDate())
                    );
                    setViewDataPicker(false)
                  }}>
                </DateTimePicker>}
            </View>
          </View>
          <View style={styles.nuovaSpesaImportoValuta}>
            <View style={styles.viewInputNuovaSpesa}>
              <Text style={styles.labelNuovaSpesa}>Importo :</Text>
              <TextInput keyboardType="numeric" style={styles.inputNuovaSpesa} onChangeText={(text) => setImporto(text)}></TextInput>
            </View>
            <View style={styles.modalViewSpaceSeparator} />
            <View style={styles.viewInputNuovaSpesa}>
              <Text style={styles.labelNuovaSpesa}>Valuta :</Text>
              <TextInput editable={false} style={[styles.inputNuovaSpesa, { color: 'black', fontWeight: 'bold', fontSize: 25 }]}>€</TextInput>
            </View>
          </View>
          <TouchableOpacity style={styles.btnNuovaSpesa} onPress={() => aggiungiSpesa()}>
            <Text style={styles.testoBtnNuovaSpesa}>Conferma</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
      <FlatList style={styles.flatList} data={spese} renderItem={renderSpese} keyExtractor={(item) => item.id} />
      <Modal
        isVisible={modalVisible}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        backdropOpacity={0.5}
        onBackdropPress={closeModal}
        style={styles.modalSpesaContainer} // Aggiungi questo stile
      >
        <ScrollView contentContainerStyle={styles.scrollViewSpesaContent}>
          <View style={styles.modalReviewSpesaContainer}>
            <View style={styles.modalReviewSpesaContent}>
              <View style={styles.modalReviewSpesaHeader}>
                <Text style={styles.modalReviewSpesaTitle}>Dettagli Spesa</Text>
                <View style={styles.modalReviewSpesaSpace}></View>
                <Ionicons name="close-circle-outline" size={30} color={'#cc0000'} onPress={closeModal}></Ionicons>
              </View>
              {selectedSpesa && (
                <>
                  <View style={styles.categoriaRow}>
                    <Image
                      source={require('../../assets/user/user-image.png')} // Imposta il percorso dell'immagine utente
                      style={styles.categoriaImage}
                    />
                    <Text style={styles.denominazioneCategoria}>Denominazione Categoria</Text>
                  </View>
                  <View style={styles.modalAreaDescrizione}>
                    <Text>{selectedSpesa.descrizione}</Text>
                  </View>
                  <View style={styles.modalAreaDataImporto}>
                    <View>
                      <Text style={styles.modalTestoImporto}>Data</Text>
                      <Text style={styles.modalTestoImporto}>{selectedSpesa.data}</Text>
                    </View>

                    <View style={styles.modalAreaSpace} />

                    <View>
                      <Text style={styles.modalTestoImporto}>Importo</Text>
                      <Text style={styles.modalTestoImporto}>{selectedSpesa.importo}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    /*
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,*/
    flex: 1,
    backgroundColor: 'white',
  },
  containerSaldoConto: {
    flexDirection:'row',
    alignItems: 'flex-end',
    paddingTop: 35,
    paddingBottom: 45,
    right: 0
    //backgroundColor: 'yellow'
  },
  cerchioEsterno: {
    width: 250, // larghezza del cerchio
    height: 120, // altezza del cerchio
    borderRadius: 25, // metà della larghezza e altezza per ottenere un cerchio
    backgroundColor: '#fde23e', // colore di sfondo del cerchio
    alignItems: 'flex-start',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    elevation: 10,
  },
  /*cerchioInterno: {
    width: 140, // larghezza del cerchio
    height: 100, // altezza del cerchio
    borderRadius: 50, // metà della larghezza e altezza per ottenere un cerchio
    backgroundColor: 'white', // colore di sfondo del cerchio
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black'
  },*/
  testo: {
    color: 'black', // colore del testo
    fontSize: 18, // dimensione del testo
    fontWeight: 'bold',
    textAlign: 'left'
  },
  containerVisualizzaElementi: {
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'black'
  },
  visualizzaElementi: {
    flexDirection: 'row',
  },
  spaceBtnChsEl: {
    width: 100,
  },
  viewPicker: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  picker: {
    height: 50,
    width: 100
  },
  nuovaSpesaBtn: {
    backgroundColor: '#fde23e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nuovaSpesaBtnText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatList: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  rigaSpesa: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row', // Per allineare gli elementi in orizzontale
    justifyContent: 'space-between', // Per distribuire gli elementi lungo l'asse principale (orizzontale) con spazio tra di essi
    alignItems: 'center', // Per allineare verticalmente gli elementi al centro
  },
  categoriaSpesa: {

  },
  descrizioneSpesa: {
    marginLeft: 10,
    flexDirection: 'column'
  },
  testoDescrizioneSpesa: {

  },
  dataDescrizioneSpesa: {
    marginTop: 10
  },
  importoSpesa: {
    marginLeft: 'auto',
  },
  testoImportoSpesa: {
    fontWeight: 'bold'
  },




  // Modal nuova Spesa
  modalNuovaSpesaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 0
  },
  modalViewNuovaSpesa: {
    flexGrow: 1,
    backgroundColor: 'white',
    width: width,
    height: height,
    padding: 20,
  },
  modalNuovaSpesaHeader: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 25
  },
  titleNuovaSpesaHeader: {
    fontWeight: 'bold',
    fontSize: 20
  },
  modalViewSpaceSeparator: {
    flex: 1
  },
  nuovaSpesaCausale: {
    paddingLeft: 15,
    borderWidth: 2,
    borderColor: 'black',
    height: height / 4,
  },
  nuovaSpesaCategoriaData: {
    flexDirection: 'row'
  },
  nuovaSpesaImportoValuta: {
    flexDirection: 'row'
  },
  btnNuovaSpesa: {
    backgroundColor: '#fde23e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 55,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 'auto',
    width: width*0.7
  },
  testoBtnNuovaSpesa: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center'
  },
  labelNuovaSpesa: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  viewInputNuovaSpesa: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginTop: 25
  },
  inputNuovaSpesa: {
    width: 150,
    textAlign: 'center',
    fontSize: 17,
    paddingBottom: 5
  },



  // Modal per la row della flatlist
  modalSpesaContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  scrollViewSpesaContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalReviewSpesaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  modalReviewSpesaContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'black'
  },
  modalReviewSpesaHeader: {
    flexDirection: 'row',
  },
  modalReviewSpesaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalReviewSpesaSpace: {
    flex: 1
  },
  categoriaRow: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoriaImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  denominazioneCategoria: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalAreaDescrizione: {
    /*borderWidth: 2,
    borderColor: 'black',*/
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'justify',
    marginBottom: 10
  },
  modalAreaDataImporto: {
    flexDirection: 'row'
  },
  modalTestoData: {
    fontWeight: 'bold'
  },
  modalAreaSpace: {
    flex: 1
  },
  modalTestoImporto: {
    fontWeight: 'bold'
  },
});

export default HomePage;