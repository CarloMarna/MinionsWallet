import React, {useState, useEffect} from 'react';
import {ScrollView, Text, TextInput, View, Modal, FlatList, SafeAreaView, StyleSheet, Image, Pressable, Button} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { SimpleGrid } from 'react-native-super-grid';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';


async function loadFonts() {
    await Font.loadAsync({
      'minions-font': require('../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
    });
  }
  loadFonts();

const Title=() => {return <Text>Inserisci una spesa</Text>}

const Importo=({database}:{database:any})=>{ 
    const [selectedValuePicker, setSelectedValuePicker] = useState("€-(EUR)");
    return(
    <View style={styles.box}>
        <Text style={styles.scritte}>Inserisci l'importo e scegli la valuta</Text>
        <View style={styles.spesa_valuta}>
            <View style={styles.spesa}>
                <TextInput placeholder='0' style={styles.testo_spesa}></TextInput>
            </View>
            <View style={styles.valuta}>
                <Picker style={styles.picker} selectedValue={selectedValuePicker} onValueChange={(itemValue) => setSelectedValuePicker(itemValue)}> 
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

const Categorie=async ({database}: {database:any}, {listaIcone}:{listaIcone:string[]})=>{
    const [selectedCategory, setSelectedCategory]=useState("");

    type ItemCategoria = {  //definico il tipo ItemCategoria con immagine e nome
        img: string;
        nomeCategoria: string;
      };
    
    /*type ItemPopUp={    //definisco il tipo delle icone
        img: string;
    };*/

    type ItemProps={    //proprietà dell'item
        item: ItemCategoria;    //item di tipo ItemCategoria
        onPress: ()=>void;  //funzione di tipo void
        backgroundColor: string;
        color: string;
    };

    type ItemPopUpProps={    //proprietà dell'item
        item: string;    //item di tipo ItemPopUp
        onPress: ()=>void;  //funzione di tipo void
        borderColor: string;
        borderWidth: number;
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

    const ItemPopUp=({item, onPress, borderColor, borderWidth}:ItemPopUpProps)=>( //definisco la costante item a cui passo le proprietà
         <View>
            <Pressable onPress={onPress}>
            {readIcone(database).map((imageName:string, index:number) => (
                <Image
                    key={index}
                    source={{ uri: imageName }}
                    style={[{borderColor, borderWidth},styles.icone]}
                />
            ))}
                
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

    const [selectedIcon, setSelectedIcon] = useState("");
    const renderItemPopUp=({item}:{item: string})=>{
        const borderColor=item===selectedIcon?'#0057BB': '';
            return(
                <ItemPopUp
                item={item}
                onPress={()=>(setSelectedIcon(item))}
                borderColor={borderColor}
                borderWidth={2}
                />
            ) 
    }
    const separator=()=>{
        return(
            <View style={styles.separator} />
        )
    }
    const [modalVisible, setModalVisible] = React.useState(false);

    
    return( //categorie mi restituisce la flatlist
        <View>
            <Text style={styles.scritte}>Scegli la categoria o creane una nuova</Text>
            <FlatList scrollEnabled data={lista_categorie} renderItem={renderItem} style={styles.categorie} numColumns={5} ItemSeparatorComponent={separator} ListFooterComponentStyle={styles.immagine_aggiunta} ListFooterComponent={<View><Pressable onPress={async () => {setModalVisible(!modalVisible)}}><Ionicons name='add-circle-outline' size={35} color='#0057BB'><Text style={styles.scritte_popup}>Inserisci un nuova categoria</Text></Ionicons></Pressable></View>}/>
            <View style={styles.vista_modal}>
                <Modal visible={modalVisible} animationType="slide" transparent={true} style={styles.modal}>
                    <View style={styles.elementi_modal}>
                        <Text style={styles.scritte_popup}>Nome categoria</Text>
                        <TextInput placeholder='Inserisci nome categoria...' ></TextInput>
                        <Text style={styles.scritte_popup}>Scegli l'icona della categoria</Text>
                        <SimpleGrid style={[{flexWrap: 'wrap', flexDirection: 'row'}]} maxItemsPerRow={5} maxDimension={4} data={listaIcone} renderItem={renderItemPopUp}/>
                        <View style={[{marginVertical:30}]}><Button title='Aggiungi categoria' onPress={()=> (setModalVisible(!modalVisible))}/></View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

const Tag=({database}:{database:any})=>{
    type ItemTag={
        name: string
    };

    const lista_tag: ItemTag[]=[
        {name: 'regalo pippo'},
        {name: 'regalo pluto'},
        {name: 'regalo pippo'},
        {name: 'regalo pluto'},
        {name: 'regalo pippo'},
        {name: 'regalo pluto'},
        {name: 'regalo pippo'},
        {name: 'regalo pluto'},
    ];

    const renderItemTag=({item}: {item: ItemTag})=>{
        const color=selectedTag.includes(item.name)?'white':'#0057BB';
        const backgroundcolor=selectedTag.includes(item.name)?'#0057BB': 'white';
        const bordercolor=selectedTag.includes(item.name)?'white':'#0057BB';
        return(
            <View>
            <Pressable onPress={()=>{
                if(selectedTag.includes(item.name))
                    setSelectedTag(selectedTag.replaceAll(item.name, ''));
                else
                    setSelectedTag(selectedTag.concat(item.name));
            }}>
                <View style={[{backgroundColor:backgroundcolor, marginRight: 10, marginLeft:5,marginVertical:10, borderColor: bordercolor, borderWidth: 1, borderRadius: 4, padding: 2}]}><Ionicons name='pricetags-outline' size={35} color={color}><Text style={[{fontFamily: 'minions-font', fontSize: 18, textAlignVertical: 'center'}]}>{item.name}</Text></Ionicons></View>
                
            </Pressable>
            </View>
        )
        
    };

    const separator=()=>{
        return(
            <View style={styles.separator} />
        )
    }

    const [selectedTag, setSelectedTag] = useState('');
    const [tagModalVisible, setTagModalVisible] = useState(false);
    const [tagText, setTagText] = useState('');

     return(
        <View style={[{flex: 1}]}>
            <Text style={styles.scritte}>Seleziona i tag o aggiungine altri</Text> 
            <FlatList data={lista_tag} renderItem={renderItemTag} ListHeaderComponentStyle={[{alignSelf:'center'}]} ListHeaderComponent={<View style={[{backgroundColor: 'white',  borderRadius: 30}]}><Pressable onPress={()=>{setTagModalVisible(!tagModalVisible)}}><Ionicons name='add-circle-outline' size={50} color='#0057BB'></Ionicons></Pressable></View>} horizontal scrollEnabled/>
            <View style={styles.vista_modal}>
            <Modal style={styles.modal} visible={tagModalVisible}  transparent={true}>
                <View style={styles.elementi_tag_modal}>
                    <Text style={styles.scritte_popup}>Inserisci il nome del tag</Text>
                    <TextInput placeholder='Nome tag...' onChangeText={(text) => setTagText(text)} style={[{width: 100, height: 50, fontSize: 15}]}></TextInput>
                    <Pressable onPress={()=>{setTagModalVisible(false); lista_tag.push({name:tagText}); setSelectedTag(selectedTag.concat(tagText));}}><Text style={styles.testo_bottone_tag}>Aggiungi tag</Text></Pressable>
                </View>
            </Modal>
            </View>
        </View>
     )
}

const NuovaSpesa=({ database }: { database: any })=>{
    const[listaIcone, setListaIcone]=useState<string[]>([]);
    useEffect(() => {
        const readIcone= async(database: any)=>{
            try{
                const icone= await database.getAllAsync(
                    'SELECT path FROM icona;'
                );
                const lista_icone: string[]=[];
                for (const row of icone) {
                    let x:string='';
                    x='..'+row.path;
                    lista_icone.push(x);
                  }
                return{lista_icone};
                //console.log(lista_icone);
            }
            catch(error){
                console.error("Errore nel prelievo delle icone", error);
                const lista_icone: string[]=[];
                return {lista_icone};
            }
        }
        
        const caricaDatiDatabase = async () => {
            try {
                const icone = await readIcone(database);
                for (const item of icone) {
                    setListaIcone(listaIcone.concat(item));
                }
            } catch (error) {
                console.log("Errore caricamento dati");
            }
        };
    
        caricaDatiDatabase();
    }, [database]);
    
const[fontLoaded, setFontLoaded] = useState(false);
    console.log(database);
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
            <ScrollView nestedScrollEnabled>
                <Importo database={database}/>
                <Categorie database={database} listaIcone={listaIcone}/>
                <Tag database={database}/>
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
        width: 304,
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
        width: 200, 
        height:60,
    },
    picker: {
        fontFamily: 'minions-font',
        flex: 1,
        width: 150,
        textAlign:'center', 
        backgroundColor: 'white',
        color: '#0057BB',
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
        fontFamily: 'minions-font',
        justifyContent: 'center',
        flex:1,
    },
    vista_modal: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'column',
    },
    elementi_modal: {
        alignItems:'center',
        backgroundColor:'white',
        width: 300,
        height:400,
        alignSelf:'center',
        marginTop:20,
        borderColor:'#0057BB',
        borderWidth:2,
        paddingVertical:15
    },
    elementi_tag_modal: {
        width: 270,
        height: 200,
        alignSelf:'center',
        marginTop:20,
        borderColor:'#0057BB',
        borderWidth:2,
        paddingVertical:15,
        alignItems:'center',
        backgroundColor:'white',
    },
    scritte_popup: {
        fontFamily:'minions-font',
        fontSize:15,
        color: '#0057BB',
        textAlign: 'left'
    },
    icone: {
        width:50, 
        height: 50
    },
    testo_bottone_tag: {
        backgroundColor: '#0057BB',
        color: 'white',
        fontFamily: 'minions-font',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 100,
        height:40,
    }
});

export default NuovaSpesa;