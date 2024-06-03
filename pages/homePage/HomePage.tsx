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
  Dimensions,
  Pressable,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getImageFromPath } from '../../script/minionImage';

const { width, height } = Dimensions.get('window');

interface Spesa {
  id: string;
  descrizione: string;
  data: string;
  importo: string;
  categoria: string;
  valuta: string;
  path_categoria: string;
}

const truncateText = (text: string, length: number = 30) => {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};


const HomePageComponent = ({ database, idConto } : { database: any, idConto:number }) => {
  const [limitElementiFlatList, setLimitElementiFlatList] = React.useState("10");
  const [saldoConto, setSaldoConto] = React.useState<GLfloat>(0);
  const [valuta, setValuta] = React.useState("€");
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [spesaModalVisible, setSpesaModalVisible] = React.useState<boolean>(false);
  const [selectedSpesa, setSelectedSpesa] = React.useState<Spesa | null>(null);
  const [spese, setSpese] = React.useState([]);
  const [isInsertNewSpesa,setStatusInsertNewSpesa] = React.useState<boolean>(false);

  const today = new Date();
  const [data, setData] = React.useState(new Date());
  const [viewDataPicker, setViewDataPicker] = React.useState(false);
  const [causale, setCausale] = React.useState([]);
  const [categoriaSelezionata, setCategoriaSelezionata] = React.useState('');
  const [categoria, setCategoria] = React.useState([]);
  const [importo, setImporto] = React.useState('');

  const dataSelezionata = (event, selectedDate) => {
    if (event.type === 'set') {
        const dataNuova = selectedDate || data;
        setData(dataNuova);
        setViewDataPicker(false);
    } else {
        setViewDataPicker(false);
    }
};

  React.useEffect(() => {
    const load_spese = async () => {
      const query = await database.getAllAsync(
        'SELECT s.id, s.descrizione, strftime("%d/%m/%Y", s.data) AS data, s.importo, s.categoria, val.simbolo AS valuta, cat.path_icona AS path ' +
        'FROM spesa AS s ' +
        'JOIN categoria AS cat ON s.categoria = cat.nome ' +
        'JOIN conto AS con ON s.id_conto = con.id ' +
        'JOIN valuta AS val ON con.sigla = val.sigla ' +
        'WHERE con.id='+idConto+' '+
        'ORDER BY s.data DESC ' +
        'LIMIT ' + limitElementiFlatList + ';'
      );
      const elencoSpese: Spesa[] = [];
      for (const row of query) {
        elencoSpese.push(row);
      }
      return { elencoSpese };
    };

    const set_spese = async () => {
      const result = await load_spese();
      setSpese(result.elencoSpese);
    };

    set_spese();

  }, [database, limitElementiFlatList, isInsertNewSpesa]);

  React.useEffect(() => {
    const fetchCategorie = async () => {
      try {
        const queryResult = await database.getAllAsync('SELECT nome FROM categoria WHERE idConto='+idConto+';');
        const categorieFromDatabase = queryResult.map((row) => row.nome);
        setCategoria(categorieFromDatabase);
        if (categorieFromDatabase.length > 0) {
          setCategoriaSelezionata(categorieFromDatabase[0]);
        }
      } catch (error) {
        console.error('Errore nel recupero delle categorie dal database:', error);
      }
    };

    fetchCategorie();
  }, [database, isInsertNewSpesa]);

  React.useEffect(() => {
    const fetchValuta = async () => {
      try {
        const queryResult = await database.getAllAsync('SELECT v.simbolo FROM valuta AS v JOIN conto AS c ON c.sigla=v.sigla WHERE c.id='+idConto+";");
        const valutaUtilizzata = queryResult.map((row) => row.simbolo);
        setValuta(valutaUtilizzata);
      } catch (error) {
        console.error('Errore nel recupero della valuta di default dal database:', error);
      }
    };

    fetchValuta();
  }, [database]);

  React.useEffect(() => {
    const fetchSaldoConto = async () => {
      try {
        const queryResult = await database.getAllAsync('SELECT CAST(SUM(s.importo) AS DECIMAL(10,2)) AS totSpesa FROM spesa AS s WHERE s.id_conto='+idConto+';');
        const totaleSpesaConto = parseFloat(queryResult.map((row) => row.totSpesa));
        if(totaleSpesaConto)
          setSaldoConto(totaleSpesaConto);
        else
          setSaldoConto(0);
      } catch (error) {
        console.error('Errore nel recupero del totale spese dal database:', error);
      }
    };

    fetchSaldoConto();
  }, [database, isInsertNewSpesa]);


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

  const aggiungiSpesa = async () => {
    try {
      if (!importo || !data || causale.length === 0 || !categoriaSelezionata) {
        return Alert.alert('Informazioni Mancanti','Ops... Hai dimenticato di inserire le informazioni, tranquillo non è successo nulla.');
      }
      const query = 'INSERT INTO spesa (importo, data, descrizione, categoria, id_conto) VALUES ('+parseFloat(importo)+', "'+data.toISOString().split('T')[0]+'", "'+causale+'", "'+categoriaSelezionata+'", '+idConto+');';
      await database.execAsync(query);
      //console.info('Inserimento riuscito!');
      setCausale([]);
      setCategoriaSelezionata('');
      setImporto('');
      setData(new Date());
      closeSpesaModal();
      Alert.alert('Nuova Spesa Aggiunta', 'Inserimento andato a buon fine.');
    } catch (error) {
      Alert.alert('Errore Inserimento Spesa', 'Ops... Qualcosa è andato storto.');
      //console.error('Errore durante l\'inserimento nel database:', error);
    }
    setStatusInsertNewSpesa(!isInsertNewSpesa)
  };

  const textInputRef = React.useRef(null);

  const handleViewPress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const renderSpese = ({ item }: { item: Spesa }) => {
    const path = getImageFromPath(item.path);
    return (
      <Pressable onPress={() => openRiepilogoSpesa(item)}>
        <View style={styles.rigaSpesa}>
          <View style={styles.categoriaSpesa}>
            <Image style={[{ width: 50, height: 50 }]} source={path} />
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
            <Text style={styles.testoImportoSpesa}>- {item.importo} {item.valuta}</Text>
          </View>
        </View>
      </Pressable>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerSaldoConto}>
        <Image source={require('../../assets/img/icone_minions/Minion-Kungfu.png')} />
        <View style={styles.cerchioEsterno}>
          <Text style={[styles.testo, { paddingLeft: 5 }]}><Ionicons size={25} name="wallet-outline" />{"  " + parseFloat(saldoConto).toFixed(2) + " " + valuta}</Text>
          <Text style={[{ paddingLeft: 5, fontSize: 13 }]}>Totale spese al {today.toLocaleDateString()}</Text>
        </View>
      </View>
      <View style={styles.containerVisualizzaElementi}>
        <View style={styles.visualizzaElementi}>
          <View style={styles.viewPicker}>
            <Picker
              limitElementiFlatList={limitElementiFlatList}
              selectedValue={limitElementiFlatList}
              style={styles.picker}
              onValueChange={(itemValue) => setLimitElementiFlatList(itemValue)}
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
            <TouchableOpacity onPress={closeSpesaModal}>
              <Ionicons name="close-circle-outline" size={30} color={'#cc0000'}></Ionicons>
            </TouchableOpacity>
          </View>
          <Text style={styles.labelNuovaSpesa}>Inserire la causale :</Text>
          <TouchableOpacity style={styles.nuovaSpesaCausale} onPress={handleViewPress}>
            <TextInput
              ref={textInputRef}
              multiline={true}
              value={causale}
              style={[{ paddingTop: 5 }]}
              onChangeText={(text) => setCausale(text)}
            />
          </TouchableOpacity>
          <View style={styles.nuovaSpesaCategoriaData}>
            <View style={styles.viewInputNuovaSpesa}>
              <Text style={styles.labelNuovaSpesa}>Categoria :</Text>
              <Picker
                style={styles.pickerCategoria}
                selectedValue={categoriaSelezionata}
                onValueChange={(itemValue) => setCategoriaSelezionata(itemValue)}
              >
                {categoria.map((categoria, index) => (
                  <Picker.Item key={index} label={categoria} value={categoria} />
                ))}
              </Picker>
            </View>
            <View style={styles.modalViewSpaceSeparator} />
            <View style={styles.viewInputNuovaSpesa}>
              <Text style={styles.labelNuovaSpesa}>Data :</Text>
              <TouchableOpacity onPress={() => { setViewDataPicker(true) }}>
                <View style={[{ flexDirection: 'row' }]}>
                  <Ionicons name='calendar-outline' color={'#0057BB'} size={25} />
                  <TextInput value={data.toLocaleDateString()} editable={false} style={[styles.inputNuovaSpesa, { width: 115, color: 'black' }]}></TextInput>
                </View>
              </TouchableOpacity>
              {viewDataPicker &&
                <DateTimePicker
                  mode='date'
                  display='calendar'
                  value={data}
                  onChange={dataSelezionata}>
                </DateTimePicker>}
            </View>
          </View>
          <View style={styles.nuovaSpesaImportoValuta}>
            <View style={styles.viewInputNuovaSpesa}>
              <Text style={styles.labelNuovaSpesa}>Importo :</Text>
              <TextInput value={importo} keyboardType="numeric" style={styles.inputNuovaSpesa} onChangeText={(text) => setImporto(text)}></TextInput>
            </View>
            <View style={styles.modalViewSpaceSeparator} />
            <View style={styles.viewInputNuovaSpesa}>
              <Text style={styles.labelNuovaSpesa}>Valuta :</Text>
              <TextInput editable={false} style={[styles.inputNuovaSpesa, { color: 'black', fontWeight: 'bold', fontSize: 25 }]}>{valuta}</TextInput>
            </View>
          </View>
          <TouchableOpacity style={styles.btnNuovaSpesa} onPress={() => aggiungiSpesa()}>
            <Text style={styles.testoBtnNuovaSpesa}>Conferma</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
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
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close-circle-outline" size={30} color={'#cc0000'}></Ionicons>
                </TouchableOpacity>
              </View>
              {selectedSpesa && (
                <>
                  <View style={styles.categoriaRow}>
                    <Image
                      source={getImageFromPath(selectedSpesa.path)} // Imposta il percorso dell'immagine utente
                      style={styles.categoriaImage}
                    />
                    <Text style={styles.denominazioneCategoria}>{selectedSpesa.categoria}</Text>
                  </View>
                  <View style={styles.modalAreaDescrizione}>
                    <Text style={styles.modalTestoImporto}>Causale :</Text>
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
                      <Text style={styles.modalTestoImporto}>{selectedSpesa.importo} {selectedSpesa.valuta}</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </Modal>
      <FlatList style={styles.flatList} data={spese} renderItem={renderSpese} keyExtractor={(item) => item.id} ListEmptyComponent={<Text style={styles.nessunaSpesa}>Nessuna Spesa Da Mostrare</Text>} />
    </SafeAreaView>
  );

};

const HomePage = ({ database, idConto }: { database: any, idConto: number }) => {
  const data = [{ key: '1', component: <HomePageComponent database={database} idConto={idConto} /> }];

  const renderItem = ({ item }) => item.component;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
    />
  );
}


const styles = StyleSheet.create({
  container: {
    /*
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,*/
    backgroundColor: '#FFF9C4',
    minHeight: height,
  },
  containerSaldoConto: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 35,
    paddingBottom: 25,
    right: 0,
    //backgroundColor: 'yellow'
  },
  cerchioEsterno: {
    width: 250, // larghezza del cerchio
    height: 120, // altezza del cerchio
    borderRadius: 25, // metà della larghezza e altezza per ottenere un cerchio
    backgroundColor: '#ffef99', // colore di sfondo del cerchio
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
    borderColor: 'rgba(0, 87, 187, 0.4)',
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
    borderBottomColor: '#0057BB',
  },
  picker: {
    height: 50,
    width: 100
  },
  pickerCategoria: {
    height: 40,
    width: 150
  },
  nuovaSpesaBtn: {
    backgroundColor: '#ffef99',
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
    paddingBottom: 20,
  },
  nessunaSpesa: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  rigaSpesa: {
    flexDirection: 'row',
    backgroundColor: '#ffef99',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 3,
    elevation: 6,
    shadowColor: '#0057BB',
    shadowOpacity: 0.5
  },
  categoriaSpesa: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  descrizioneSpesa: {
    flex: 1,
    justifyContent: 'center',
  },
  testoDescrizioneSpesa: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataDescrizioneSpesa: {
    fontSize: 14,
    color: '#777',
  },
  importoSpesa: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  testoImportoSpesa: {
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: '#FFF9C4',
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
    borderColor: '#0057BB',
    height: height / 4,
    borderRadius: 18
  },
  nuovaSpesaCategoriaData: {
    flexDirection: 'row'
  },
  nuovaSpesaImportoValuta: {
    flexDirection: 'row'
  },
  btnNuovaSpesa: {
    backgroundColor: '#ffef99',
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
    width: width * 0.7
  },
  testoBtnNuovaSpesa: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  labelNuovaSpesa: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  viewInputNuovaSpesa: {
    borderBottomWidth: 2,
    borderBottomColor: '#0057BB',
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
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
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
    margin: 'auto',
  },
  denominazioneCategoria: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalAreaDescrizione: {
    /*borderWidth: 2,
    borderColor: '#0057BB',*/
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