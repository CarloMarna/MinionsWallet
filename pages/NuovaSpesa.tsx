import React, {useState, useEffect} from 'react';
import {ScrollView, Text, TextInput, View, Modal, FlatList, SafeAreaView, StyleSheet, Image, Pressable, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { SimpleGrid } from 'react-native-super-grid';


async function loadFonts() {
    await Font.loadAsync({
      'minions-font': require('../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
    });
  }
  loadFonts();

const Title=() => {return <Text>Inserisci una spesa</Text>}

const Importo=()=>{ 
    return(
    <View style={styles.box}>
        <Text style={styles.scritte}>Inserisci l'importo e scegli la valuta</Text>
        <View style={styles.spesa_valuta}>
            <View style={styles.spesa}>
                <TextInput placeholder='0' style={styles.testo_spesa}></TextInput>
            </View>
            <View style={styles.valuta}>
                <Picker style={styles.picker}>
                    <Picker.Item value="euro" label="€-(EUR)"/>
                    <Picker.Item value="dollaro_usa" label="$-(USD)"/>
                    <Picker.Item value="yen_japan" label="¥-(JPY)"/>
                    <Picker.Item value="sterlina" label="£-(GBP)"/>
                    <Picker.Item value="dollaro_australia" label="$-(AUD)"/>
                    <Picker.Item value="dollaro_canada" label="$-(CAD)"/>
                    <Picker.Item value="franco_svizzero" label="CHF-(CHF)"/>
                    <Picker.Item value="yuan_cina" label="¥-(CNY)"/>
                    <Picker.Item value="corona_svezia" label="kr-(SEK)"/>
                    <Picker.Item value="dollaro_nuova_zelanda" label="$-(NZD)"/>
                    <Picker.Item value="rupia_india" label="₹-(INR)"/>
                    <Picker.Item value="rublo _russo" label="₽-(RUB)"/>
                    <Picker.Item value="won_sudcorea" label="₩-(KRW)"/>
                    <Picker.Item value="peso_messico" label="$-(MXN)"/>
                    <Picker.Item value="real_brasile" label="R$-(BRL)"/>
                    <Picker.Item value="rand_sudafrica" label="R-(ZAR)"/>
                    <Picker.Item value="baht_thailandia" label="฿-(THB)"/>
                    <Picker.Item value="riyal_saudi" label="﷼-(SAR)"/>
                    <Picker.Item value="lira_turchia" label="₺-(TRY)"/>
                    <Picker.Item value="dirham_Emirati_Arabi_Uniti" label="د.إ-(AED)"/>
                </Picker>
            </View>
        </View>
        <View>
            
        </View>
    </View>
    
)}

const Categorie=()=>{
    const [selectedCategory, setSelectedCategory]=useState("");

    type ItemCategoria = {  //definico il tipo ItemCategoria con immagine e nome
        img: string;
        nomeCategoria: string;
      };

    type ItemProps={    //proprietà dell'item
        item: ItemCategoria;    //item di tipo ItemCategoria
        onPress: ()=>void;  //funzione di tipo void
        backgroundColor: string;
        color: string;
    };

    const lista_categorie: ItemCategoria[]=[    //lista categorie di tipo ItemCategoria
        {img: require('../assets/img/icone_minions/Minion-Bananas.png'),
        nomeCategoria: 'cibo'},
        {img: require('../assets/img/icone_minions/Minion-Cake.png'),
        nomeCategoria: 'feste'},
        {img: require('../assets/img/icone_minions/Minion-Crazy.png'),
        nomeCategoria: 'amici'},
        {img: require('../assets/img/icone_minions/Minion-Bananas.png'),
        nomeCategoria: 'fidanzata'},
        {img: require('../assets/img/icone_minions/Minion-Cake.png'),
        nomeCategoria: 'regali'},
        {img: require('../assets/img/icone_minions/Minion-Crazy.png'),
        nomeCategoria: 'bollette'},
    ];

    const Item=({item, onPress, backgroundColor, color}:ItemProps)=>( //definisco la costante item a cui passo le proprietà
        <View>
            <Pressable onPress={onPress}>
                <Image source={item.img} style={styles.immagine_categoria}/>
                <Text style={[{backgroundColor, color}, styles.testo_categoria]}>{item.nomeCategoria}</Text>
            </Pressable>
        </View>
    );

    const renderItem=({item}:{item: ItemCategoria}) => {    //destrutturazione per estrapolare la proprietà item
        const backgroundColor = item.nomeCategoria === selectedCategory ? '#0057BB' : 'white';
        const color= item.nomeCategoria===selectedCategory ? 'white' : '#0057BB';
        return (    //restituisco l'item con le proprietà settate
            <Item
              item={item}
              onPress={() => setSelectedCategory(item.nomeCategoria)}
              backgroundColor={backgroundColor}
              color={color}
            />
        );
    };

    const separator=()=>{
        return(
            <View style={styles.separator} />
        )
    }
    const [modalVisible, setModalVisible] = React.useState(false);

    return( //categorie mi restituisce la flatlist
        <View>
            <Text style={styles.scritte}>Scegli la categoria o creane una nuova</Text>
            <FlatList data={lista_categorie} renderItem={renderItem} style={styles.categorie} numColumns={5} ItemSeparatorComponent={separator} ListFooterComponentStyle={styles.immagine_aggiunta} ListFooterComponent={<View><Pressable onPress={() => setModalVisible(!modalVisible)}><Ionicons name='add-circle-outline' size={35} color='#0057BB'></Ionicons></Pressable></View>}/>
            <View style={styles.vista_modal}>
                <Modal visible={modalVisible} animationType="slide" transparent={true} style={styles.modal}>
                    <View style={styles.elementi_modal}>
                        <Text style={styles.scritte_popup}>Nome categoria</Text>
                        <TextInput placeholder='Inserisci nome categoria...' ></TextInput>
                        <Text style={styles.scritte_popup}>Scegli l'icona della categoria</Text>
                        <SimpleGrid style={[{flexWrap: 'wrap', flexDirection: 'row'}]} itemDimension={30} data={['../assets/img/icone_minions/Minion-Bananas.png', '../assets/img/icone_minions/Minion-Bananas.png', '../assets/img/icone_minions/Minion-Bananas.png','../assets/img/icone_minions/Minion-Bananas.png', '../assets/img/icone_minions/Minion-Bananas.png', '../assets/img/icone_minions/Minion-Bananas.png',  '../assets/img/icone_minions/Minion-Bananas.png']} renderItem={({item})=>(<Image style={[{borderColor:'black', borderWidth:2, width:30, height: 30}]} source={item}></Image>)}/>
                        <View style={[{marginVertical:30}]}><Button title='Aggiungi categoria' onPress={()=> setModalVisible(!modalVisible)}/></View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}


function NuovaSpesa(){
const[fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        async function loadApp() {
          await loadFonts();
          setFontLoaded(true);
        }
        loadApp();
      }, []);
    
      if (!fontLoaded) {
        return null;
    }

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:'#FEEC47'}}>
            <ScrollView>
                <Importo />
                <Categorie />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles=StyleSheet.create({
    box: {
        marginTop:10,
        flex: 1
    },
    spesa_valuta: {
        marginVertical: 30,
        flexDirection: 'row',
        width: 250,
        alignSelf: 'center'
    },
    testo_spesa: {
        fontFamily: 'minions-font',
        fontSize: 16,
        color: '#0057BB',
        borderColor:'#0057BB',
        width: 80,
        height: 60,
        textAlign:'center',
        borderBottomWidth:2,
        borderTopWidth:2,
        borderLeftWidth:2,
        borderRadius:6,
        backgroundColor: 'white'
    },
    spesa:{
        flex:1, 
        alignItems: 'flex-end'
    },
    valuta:{
        flex:1,
        alignItems: 'flex-start',
        borderColor: '#0057BB',
        borderBottomWidth:2,
        borderTopWidth:2,
        borderRightWidth:2,
        borderRadius:6,
        width: 170, 
        height:60,
    },
    picker: {
        fontFamily: 'minions-font',
        flex: 1,
        width: '100%',
        textAlign:'center', 
        backgroundColor: 'white',
        color: '#0057BB'
    },
    scritte: {
        fontFamily:'minions-font',
        fontSize:20,
        color: '#0057BB',
        textAlign: 'center'
    },
    categorie: {
        backgroundColor:'white',
        borderColor: '#0057BB',
        borderWidth: 2,
        borderRadius: 20,
        flex: 1,
        width: 370,
        paddingHorizontal:7,
        marginVertical: 20,
        flexDirection: 'row',
        paddingVertical: 10,
        alignSelf: 'center'
    },
    separator: {
        height: 20
    },
    testo_categoria: {
        fontFamily: 'minions-font',
        textAlign: 'center',
        borderColor:'#0057BB',
        borderWidth: 1,
        borderRadius:4,
        marginHorizontal:1
    },
    immagine_categoria: {
        width:70,
        height:70
    },
    immagine_aggiunta: {
        width: 50,
        height: 50,
        marginTop: 20,
        marginLeft: 20
    },
    modal: {
        backgroundColor: 'white',
        color: '#0057BB',
        fontFamily: 'minions-font'
    },
    vista_modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    elementi_modal: {
        alignItems:'center',
        backgroundColor:'white',
        width:300,
        height:300
    },
    scritte_popup: {
        fontFamily:'minions-font',
        fontSize:15,
        color: '#0057BB',
        textAlign: 'left'
    }
});

export default NuovaSpesa;