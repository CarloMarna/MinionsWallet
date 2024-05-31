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

const aggiungiSpesa = () => {
  console.log();
};

const HomePage = () => {
  const [selectedValue, setSelectedValue] = React.useState("10");
  const [saldoConto, setSaldoConto] = React.useState(600);
  const [valuta, setValuta] = React.useState("$");
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
        <View style={styles.cerchioEsterno}>
          <View style={styles.cerchioInterno}>
            <Text style={styles.testo}>Saldo Conto {saldoConto + valuta}</Text>
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
        <View style={styles.modalViewNuovaSpesa}>
          <View style={styles.modalNuovaSpesaHeader}>
            <Text style={styles.titleNuovaSpesaHeader}>Inserisci Nuova Spesa</Text>
            <View style={styles.modalViewSpaceSeparator}></View>
            <Ionicons name="close-circle-outline" size={30} color={'#cc0000'} onPress={closeSpesaModal}></Ionicons>
          </View>
          <View style={styles.nuovaSpesaCausale}>
            <TextInput>Causale</TextInput>
          </View>
          <View style={styles.nuovaSpesaCategoriaData}>
            <View>
              <Text style={styles.labelNuovaSpesa}>Categoria</Text>
              <TextInput style={styles.inputNuovaSpesa}></TextInput>
            </View>
            <View style={styles.modalViewSpaceSeparator} />
            <View>
              <Text style={styles.labelNuovaSpesa}>Data</Text>
              <TextInput style={styles.inputNuovaSpesa}></TextInput>
            </View>
          </View>
          <View style={styles.nuovaSpesaImportoValuta}>
            <View>
              <Text style={styles.labelNuovaSpesa}>Importo</Text>
              <TextInput style={styles.inputNuovaSpesa}></TextInput>
            </View>
            <View style={styles.modalViewSpaceSeparator} />
            <View>
              <Text style={styles.labelNuovaSpesa}>Valuta</Text>
              <TextInput style={styles.inputNuovaSpesa}></TextInput>
            </View>
          </View>
          <TouchableOpacity style={styles.btnNuovaSpesa} onPress={() => aggiungiSpesa()}>
            <Text style={styles.testoBtnNuovaSpesa}>Conferma</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    marginTop: 45,
    marginBottom: 45
  },
  cerchioEsterno: {
    width: 200, // larghezza del cerchio
    height: 120, // altezza del cerchio
    borderRadius: 75, // metà della larghezza e altezza per ottenere un cerchio
    backgroundColor: '#4CAF50', // colore di sfondo del cerchio
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black'
  },
  cerchioInterno: {
    width: 140, // larghezza del cerchio
    height: 100, // altezza del cerchio
    borderRadius: 50, // metà della larghezza e altezza per ottenere un cerchio
    backgroundColor: 'white', // colore di sfondo del cerchio
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'black'
  },
  testo: {
    color: 'black', // colore del testo
    fontSize: 18, // dimensione del testo
    fontWeight: 'bold',
    textAlign: 'center'
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
    borderWidth: 3,
    borderColor: 'black'
  },
  picker: {
    height: 50,
    width: 100
  },
  nuovaSpesaBtn: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  nuovaSpesaBtnText: {
    color: 'white',
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
    alignItems: 'center'
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
    padding: 15,
    borderWidth: 2,
    borderColor: 'black',
    height: height / 4
  },
  nuovaSpesaCategoriaData: {
    flexDirection: 'row'
  },
  nuovaSpesaImportoValuta: {
    flexDirection: 'row'
  },
  btnNuovaSpesa: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 25,
  },
  testoBtnNuovaSpesa: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center'
  },
  labelNuovaSpesa: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputNuovaSpesa: {
    borderWidth: 2,
    borderColor: 'black',
    width: 150
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