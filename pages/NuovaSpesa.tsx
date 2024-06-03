import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, View, Modal, FlatList, SafeAreaView, StyleSheet, Image, Pressable, Button, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { getImageFromPath, getImagePathFromId } from '../script/minionImage';
import { ins } from '../script/types';
import { conversioneValuta } from '../script/conversioneValuta';
import { formatDate } from '../script/scriptStatisticheGrafici';


async function loadFonts() {
    await Font.loadAsync({
        'minions-font': require('../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
    });
}
loadFonts();

const Importo = ({ database, idConto, inserimento }) => {
    type itemValuta = {
        sigla: string,
        nome: string,
        simbolo: string;
    };
    const [loadingImporto, setLoadingImporto] = useState(false);
    const [listaValute, setListaValute] = useState<itemValuta[]>([]);

    useEffect(() => {
        const load_valute = async () => {
            const valute = await database.getAllAsync('SELECT sigla, nome, simbolo FROM valuta;');
            const lista_valute: itemValuta[] = [];
            for (const row of valute) {
                lista_valute.push(row);
            }
            return { lista_valute };
        };

        const set_valute = async () => {
            const result = await load_valute();
            setListaValute(result.lista_valute);
        };

        set_valute();
        setLoadingImporto(true);
    }, [database]);


    const x = database.getFirstSync(`SELECT c.sigla, v.nome, v.simbolo FROM conto AS c JOIN valuta AS v ON v.sigla=c.sigla WHERE c.id=${idConto};`)
    const [selectedValuePicker, setSelectedValuePicker] = useState<itemValuta>(x);

    if (!loadingImporto) {
        return (
            <View style={styles.containerCaricamento}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={[styles.textContainerCaricamento, { color: '#0057BB' }]}>Caricamento...</Text>
            </View>
        );
    }
    //console.log("Importo "+inserimento.importo);
    return (
        <View style={styles.box}>
            <Text style={styles.scritte}>Inserisci l'importo e scegli la valuta</Text>
            <View style={styles.spesa_valuta}>
                <View style={styles.spesa}>
                    <TextInput placeholder='0' defaultValue={(inserimento.importo).toString()} style={styles.testo_spesa} keyboardType='numeric' inputMode='numeric' onChangeText={(text) => inserimento.importo = text}></TextInput>
                </View>
                <View style={styles.valuta}>
                    <Picker style={styles.picker} selectedValue={selectedValuePicker} onValueChange={(itemValue) => { setSelectedValuePicker(itemValue); inserimento.v_nome = itemValue.nome; inserimento.v_sigla = itemValue.sigla; inserimento.v_simbolo = itemValue.simbolo; }}>
                        {listaValute.map((item, index) => (
                            <Picker.Item key={index} label={item.simbolo + '-' + item.nome + '(' + item.sigla + ')'} value={item} />
                        ))}

                    </Picker>
                </View>
            </View>
        </View>

    )
}

const Categorie = ({ database, idConto, inserimento }) => {
    const [icone, setIcone] = useState<string[]>([]);
    const [listaCategorie, setListaCategorie] = useState<ItemCategoria[]>([]);
    const [isLoadingCategorie, setIsLoadingCategorie] = useState(false);

    type ItemCategoria = {  //definico il tipo ItemCategoria con immagine e nome
        img: string;
        nomeCategoria: string;
    };

    const eliminaCategorie = (database: any) => {
        try {
            const categorieDaEliminare = database.getAllSync(
                `SELECT ca1.idConto, ca1.nome FROM categoria AS ca1
                WHERE (ca1.idConto, ca1.nome) NOT IN (SELECT ca2.idConto, ca2.nome FROM categoria AS ca2 
                JOIN spesa AS s ON ca2.idConto=s.id_conto AND ca2.nome=s.categoria 
                WHERE ca2.idConto=${idConto});`
            );
            //console.log(categorieDaEliminare);
            for (const x of categorieDaEliminare) {
                //console.log(x.idConto+x.nome);
                database.execSync(`DELETE FROM categoria WHERE categoria.idConto=${x.idConto} AND categoria.nome='${x.nome}';`);

            }
        }
        catch (error) {
            console.log("Errore nell'eliminazione dell categorie" + error);
        }
    }

    const readCategorie = async (database: any) => {
        try {
            const categorie = await database.getAllAsync(
                `SELECT ca.nome, ca.path_icona FROM categoria AS ca 
                JOIN conto AS co ON ca.idConto=co.id WHERE co.id=${idConto};`
            );
            if (categorie != null) {
                const lista_categorie: ItemCategoria[] = [];
                for (const row of categorie) {
                    let x = getImageFromPath(row.path_icona)    //ottengo il numero
                    let y: ItemCategoria = {   //creo una variabile dove metto numero e nome
                        img: x,
                        nomeCategoria: row.nome
                    };
                    lista_categorie.push(y);
                }
                return { lista_categorie };
            }
            else return null;
        }
        catch (error) {
            console.error("Errore nel prelievo delle categorie", error);
            return [];
        }
    }

    const fetchCategorie = async () => {
        try {
            const result = await readCategorie(database);
            setListaCategorie(result.lista_categorie);
        } catch (error) {
            console.error("Errore nel prelievo delle icone", error);
        }
    };

    useEffect(() => {
        const readIcone = async (database: any) => {
            try {
                const icone = await database.getAllAsync(
                    `SELECT path FROM icona;`
                );
                const lista_icone: string[] = [];
                for (const row of icone) {
                    lista_icone.push(row.path);
                }
                return { lista_icone };
            }
            catch (error) {
                console.error("Errore nel prelievo delle icone", error);
                return [];
            }
        }

        const fetchIcone = async () => {
            try {
                const result = await readIcone(database);
                setIcone(result.lista_icone);
            } catch (error) {
                console.error("Errore nel prelievo delle icone", error);
            }
        };

        eliminaCategorie(database);
        fetchIcone();
        fetchCategorie();
        setIsLoadingCategorie(true);
        //console.log("categoria sel. "+inserimento.nome_cat);
        setSelectedCategory((inserimento.nome_cat).toString());
    }, [database, inserimento.nome_cat]);

    const [selectedCategory, setSelectedCategory] = useState('');


    type ItemProps = {    //proprietà dell'item
        item: ItemCategoria;    //item di tipo ItemCategoria
        onPress: () => void;  //funzione di tipo void
        backgroundColor: string;
        color: string;
    };

    type ItemPopUpProps = {    //proprietà dell'item
        item: string;    //item di tipo ItemPopUp
        onPress: () => void;  //funzione di tipo void
        borderColor: string;
    };

    const Item = ({ item, onPress, backgroundColor, color }: ItemProps) => ( //definisco la costante item a cui passo le proprietà
        <View>
            <Pressable onPress={onPress} style={[{ marginHorizontal: 2 }]}>
                <Image source={item.img} style={styles.immagine_categoria} />
                <Text style={[{ backgroundColor, color }, styles.testo_categoria]}>{item.nomeCategoria}</Text>
            </Pressable>
        </View>
    );


    const renderItem = ({ item }: { item: ItemCategoria }) => {    //destrutturazione per estrapolare la proprietà item
        const backgroundColor = item.nomeCategoria === selectedCategory ? '#0057BB' : 'white';
        const color = item.nomeCategoria === selectedCategory ? 'white' : '#0057BB';
        return (    //restituisco l'item con le proprietà settate
            <Item
                item={item}
                onPress={() => { setSelectedCategory(item.nomeCategoria); inserimento.nome_cat = item.nomeCategoria; }}
                backgroundColor={backgroundColor}
                color={color}
            />
        );
    };

    const ItemPopUp = ({ item, onPress, borderColor }: ItemPopUpProps) => ( //definisco la costante item a cui passo le proprietà    
        <View>
            <Pressable onPress={onPress} style={styles.icone}>
                <Image source={item} style={[{ borderColor, borderWidth: 1 }, styles.icone]} />
            </Pressable>
        </View>
    );

    const [selectedIcon, setSelectedIcon] = useState("");
    const [imgAggiuntaCategoria, setImgAggiuntaCategoria] = useState('');
    const [textAggiuntaCategoria, setTextAggiuntaCategoria] = useState('');

    const renderItemPopUp = ({ item }: { item: string }) => {
        const borderColor = item === selectedIcon ? '#0057BB' : '';
        const path = getImageFromPath(item);
        return (
            <ItemPopUp
                item={path}
                onPress={() => { setSelectedIcon(item); setImgAggiuntaCategoria(getImagePathFromId(path)); }}
                borderColor={borderColor}
            />
        )
    }

    const separator = () => {
        return (
            <View style={styles.separator} />
        )
    }
    const [modalVisible, setModalVisible] = React.useState(false);
    if (!isLoadingCategorie) {
        return (
            <View style={styles.containerCaricamento}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={[styles.textContainerCaricamento, { color: '#0057BB' }]}>Caricamento...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView>
            <Text style={styles.scritte}>Scegli la categoria</Text>
            <View style={[{ height: 'auto' }]}>
                <FlatList scrollEnabled data={listaCategorie} renderItem={renderItem} style={styles.categorie} ItemSeparatorComponent={separator} />
                <View>
                    <TouchableOpacity onPress={async () => { setModalVisible(!modalVisible) }}>
                        <View style={[styles.botton, { alignSelf: 'flex-start', backgroundColor: 'white', borderColor: '#0057BB', borderWidth: 1, width: 'auto', paddingHorizontal: 5, marginHorizontal: 10 }]}>
                            <Ionicons name='add-circle-outline' size={35} color='#0057BB'>
                                <Text style={[styles.scritte, { color: '#0057BB', fontSize: 15 }]}>Inserisci un nuova categoria</Text>
                            </Ionicons>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.vista_modal}>
                <Modal visible={modalVisible} animationType="slide" transparent={true} style={styles.modal}>
                    <View style={styles.elementi_modal}>
                        <Text style={styles.scritte_popup}>Nome categoria</Text>
                        <TextInput placeholder='Inserisci nome categoria...' onChangeText={(text) => setTextAggiuntaCategoria(text)} ></TextInput>
                        <Text style={styles.scritte_popup}>Scegli l'icona della categoria</Text>
                        <View style={[{ height: 200, margin: 10 }]}><FlatList scrollEnabled style={[{ flexWrap: 'wrap', flexDirection: 'row' }]} numColumns={5} data={icone} renderItem={renderItemPopUp} /></View>
                        <View style={[{ marginTop: 30, marginBottom: 15 }]}><Button title='Aggiungi categoria' onPress={() => {
                            if (textAggiuntaCategoria != '' && imgAggiuntaCategoria != '') {
                                setModalVisible(!modalVisible);
                                database.execSync(`INSERT INTO categoria VALUES('${textAggiuntaCategoria}','${idConto}','${imgAggiuntaCategoria}');`);
                                const y: ItemCategoria = {
                                    img: imgAggiuntaCategoria,
                                    nomeCategoria: textAggiuntaCategoria
                                };
                                fetchCategorie();
                                setSelectedCategory(textAggiuntaCategoria);
                                inserimento.nome_cat = textAggiuntaCategoria;
                                setImgAggiuntaCategoria('');
                                setTextAggiuntaCategoria('');
                            }
                            else {
                                Alert.alert("Attenzione!", "Inserire entrambi i campi");
                            }
                        }} /></View>
                        <View><Button title='Annulla' onPress={() => {
                            setModalVisible(!modalVisible);
                            setImgAggiuntaCategoria('');
                            setTextAggiuntaCategoria('');
                        }} /></View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
};

const Tag = ({ database, inserimento }) => {
    const [tag, setTag] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState<string[]>([]);
    const [isLoadingTag, setIsLoadingTag] = useState(false);
    useEffect(() => {
        const readTag = async () => {
            try {
                const lista_tag = await database.getAllAsync(`SELECT nome FROM tag;`);
                const lista: String[] = [];
                for (const row of lista_tag) {
                    lista.push(row.nome);
                }
                return { lista };
            }
            catch (error) {
                console.error("Errore nel prelievo delle icone", error);
                return [];
            }
        }
        const setListaTag = async () => {
            const result = await readTag();
            setTag(result.lista);
        }
        setSelectedTag(inserimento.tag);
        setListaTag();
        setIsLoadingTag(true);
    }, [database, inserimento.tag]);

    const renderItemTag = ({ item }: { item: string }) => {
        const color = selectedTag.includes(item) ? 'white' : '#0057BB';
        const backgroundcolor = selectedTag.includes(item) ? '#0057BB' : 'white';
        const bordercolor = selectedTag.includes(item) ? 'white' : '#0057BB';
        return (
            <View>
                <Pressable onPress={() => {
                    setSelectedTag(prevTags => {    //uso la callback perchè in questo modo ho sempre il vlore più recente di selected tag
                        if (prevTags.includes(item)) {
                            inserimento.tag = prevTags.filter(x => x !== item);
                            return inserimento.tag;
                        } else {
                            inserimento.tag = prevTags.concat(item);
                            return inserimento.tag;
                        }
                    });
                }}>
                    <View style={[{ backgroundColor: backgroundcolor, marginRight: 10, marginLeft: 5, marginVertical: 10, borderColor: bordercolor, borderWidth: 1, borderRadius: 4, padding: 2 }]}><Ionicons name='pricetags-outline' size={35} color={color}><Text style={[{ fontFamily: 'minions-font', fontSize: 18, textAlignVertical: 'center' }]}>{item}</Text></Ionicons></View>
                </Pressable>
            </View>
        )

    };

    const [tagModalVisible, setTagModalVisible] = useState(false);
    const [tagText, setTagText] = useState('');

    if (!isLoadingTag) {
        return (
            <View style={styles.containerCaricamento}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={[styles.textContainerCaricamento, { color: '#0057BB' }]}>Caricamento...</Text>
            </View>
        );
    }

    return (
        <View style={[{ flex: 1 }]}>
            <Text style={styles.scritte}>Seleziona i tag o aggiungine altri</Text>
            <FlatList style={[{ marginVertical: 5 }]} data={tag} renderItem={renderItemTag} ListHeaderComponentStyle={[{ alignSelf: 'center' }]} ListHeaderComponent={<View style={[{ backgroundColor: 'white', borderRadius: 30 }]}><Pressable onPress={() => { setTagModalVisible(!tagModalVisible) }}><Ionicons name='add-circle-outline' size={50} color='#0057BB'></Ionicons></Pressable></View>} horizontal scrollEnabled />
            <View style={styles.vista_modal}>
                <Modal style={styles.modal} visible={tagModalVisible} transparent={true}>
                    <View style={styles.elementi_tag_modal}>
                        <Text style={styles.scritte_popup}>Inserisci il nome del tag</Text>
                        <TextInput placeholder='Nome tag...' onChangeText={(text) => setTagText(text)} style={[{ width: 100, height: 50, fontSize: 15 }]}></TextInput>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', marginVertical: 'auto' }]}>
                            <Pressable style={[{ marginRight: 5 }]} onPress={() => { setTagModalVisible(false); tag.push(tagText); setTag(tag); setSelectedTag(selectedTag.concat(tagText)); database.execSync(`INSERT INTO tag VALUES('${tag}');`); inserimento.tag = selectedTag }}><Text style={styles.testo_bottone_tag}>Aggiungi tag</Text></Pressable>
                            <Pressable onPress={() => setTagModalVisible(false)}><Text style={styles.testo_bottone_tag}>Annulla</Text></Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
};

const Descrizione = ({ database, inserimento }: { database: any, inserimento: ins }) => {
    const [text, setText] = useState('');
    return (
        <View style={[{ flex: 1 }]}>
            <Text style={[styles.scritte, { marginBottom: 10 }]}>Inserisci la descrizione</Text>
            <TextInput defaultValue={inserimento.descrizione} onChangeText={(inputText) => { setText(inputText); inserimento.descrizione = inputText; }} multiline placeholder='Scrivi qui la descrizione...' style={styles.inputDescrizione}></TextInput>
        </View>
    )
}

const Data = ({ database, inserimento }: { database: any, inserimento: ins }) => {
    const [data, setData] = useState(new Date(inserimento.data));
    const [viewDataPicker, setViewDataPicker] = useState(false);

    return (
        <View>
            <Text style={[styles.scritte, { marginBottom: 5, marginTop: 7 }]}>Inserisci la data</Text>
            <View style={[{ margin: 10, flex: 1, flexDirection: 'row' }]}>
                <Pressable onPress={() => { setViewDataPicker(true) }}>
                    <View style={[{ backgroundColor: 'white', width: 'auto', height: 'auto', borderRadius: 6, borderColor: '#0057BB', borderWidth: 1 }]}><Ionicons name='calendar-outline' color={'#0057BB'} size={60} style={[{ alignSelf: 'center' }]} /></View>
                </Pressable>
                {viewDataPicker && <DateTimePicker mode='date' display='calendar' value={data} onChange={(event, date) => { setData(new Date(date.getFullYear(), date.getMonth(), date.getDate())); setViewDataPicker(false); inserimento.data = data; }}></DateTimePicker>}
                <Text style={styles.scrittaData}>Hai effettuato la spesa il {data && data.toLocaleDateString()}</Text>
            </View>
        </View>


    )
}

const BottoneAggiuntaSpesa = ({ database, idConto, inserimento, isModifing }: { database: any, idConto: any, inserimento: ins, isModifing: boolean }) => {

    function insert() {
        if (inserimento.data != null && inserimento.descrizione != '' && inserimento.importo != '' && inserimento.nome_cat != '' && inserimento.v_sigla != '') {
            let x = database.getFirstSync(`SELECT sigla FROM conto WHERE id=${idConto};`);
            if (x.sigla != inserimento.v_sigla) {
                conversioneValuta(inserimento.v_sigla, x.sigla, inserimento.importo).then(importoConvertito => {
                    database.execSync(`INSERT INTO spesa (importo, data, descrizione, categoria, id_conto) VALUES (${importoConvertito}, '${formatDate(inserimento.data)}', '${inserimento.descrizione}', '${inserimento.nome_cat}', ${idConto});`)
                })
            }
            else {
                try {
                    database.execSync(`INSERT INTO spesa (importo, data, descrizione, categoria, id_conto) VALUES (${inserimento.importo}, '${formatDate(inserimento.data)}', '${inserimento.descrizione}', '${inserimento.nome_cat}', ${idConto});`);
                }
                catch (error) {
                    console.log("errore aggiunta query" + error);
                }
            }
            let id_spesa = database.getFirstSync(`SELECT MAX(id) as id FROM spesa;`);
            for (let x = 0; x < inserimento.tag.length; x++) {
                if (inserimento.tag[x] != '') {
                    try {
                        database.execSync(`INSERT INTO tag_spesa (id_spesa, nome_tag) VALUES(${id_spesa.id}, '${inserimento.tag[x]}');`);
                    }
                    catch (error) {
                        console.log("errore aggiunta tag" + error);
                    }

                }
            }
            Alert.alert("Operazione completata!", "Spesa aggiunta correttamente.");
        }
        else {
            Alert.alert("Attenzione!", "Spesa non aggiunta. Compilare tutti i campi obbligatori.");
        }
    };

    function upl() {
        if (inserimento.data != null && inserimento.descrizione != '' && inserimento.importo != '' && inserimento.nome_cat != '' && inserimento.v_sigla != '') {
            try {
                var query= `UPDATE spesa SET importo=${inserimento.importo}, data='${formatDate(new Date(inserimento.data))}', descrizione='${inserimento.descrizione}', categoria='${inserimento.nome_cat}', id_conto=${idConto} WHERE id=${inserimento.idSpesa};`;
                database.execSync(query);
            }
            catch (error) {
                console.log("errore aggiornamento query" + error);
            }
        }

        const tagPrecedenti = database.getAllSync(`SELECT nome_tag FROM tag_spesa WHERE id_spesa=${inserimento.idSpesa};`);


        let tag = inserimento.tag;
        console.log(inserimento.tag);
        for (const y of tagPrecedenti) {
            if (!tag.includes(y.nome_tag)) {
                database.execSync(`DELETE FROM tag_spesa WHERE id_spesa=${inserimento.idSpesa} AND nome_tag='${y.nome_tag}';`);
            }
        }
        for (var i = 0; i<tag.length; i++) {
            if (tag[i] != '' && !tagPrecedenti.some(t => t.nome_tag === tag[i])) {
                try {
                    //console.log(tag[i]+" "+!tagPrecedenti.includes(tag[i]));
                    const query = `INSERT INTO tag_spesa VALUES (${inserimento.idSpesa}, '${tag[i]}');`;
                    console.log(query);
                    database.execSync(query);
                }
                catch (error) {
                    console.log("errore aggiunta tag" + error);
                }

            }
        }
    };

    const txtBottone = isModifing ? "Applica Modifiche" : "Aggiungi Spesa";

    return (
        <View>
            <TouchableOpacity onPress={() => {
                if (!isModifing)
                    insert();
                else
                    upl();
            }}>
                <View style={styles.botton}>
                    <Ionicons name='basket-outline' color='white' size={30}></Ionicons>
                    <Text style={[styles.scritte, { color: 'white' }]}>{txtBottone}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}
/*
let inserimento: ins={
    importo:'',
    v_simbolo: '',
    v_nome:'',
    v_sigla:'',
    nome_cat:'',
    descrizione: '',
    data:new Date(),
    tag:[]
};*/

const NuovaSpesaComponent = ({ database, idConto, inserimento, isModifing }: { database: any, idConto: number, inserimento: any, isModifing: boolean }) => {

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
    //console.log(inserimento.importo);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF9C4' }}>
            <Importo database={database} idConto={idConto} inserimento={inserimento} />
            <Categorie database={database} idConto={idConto} inserimento={inserimento} />
            <Descrizione database={database} inserimento={inserimento} />
            <Data database={database} inserimento={inserimento} />
            <Tag database={database} inserimento={inserimento} />
            <BottoneAggiuntaSpesa database={database} idConto={idConto} inserimento={inserimento} isModifing={isModifing} />
        </SafeAreaView>
    )

};

const NuovaSpesa = ({ database, idConto, route }: { database: any, idConto: any, route: any }) => {
    const [isModifing, setIsModifing] = useState<boolean>(false);
    const today = new Date();
    /*const [modificaImporto, setModificaImporto] = useState('');
    const [modificaCategoria, setModficaCategoria]=useState('');
    const [modificaTag, setModificaTag]=useState<string[]>([]);
    const [modificaDescrizione, setModificaDescrizione]=useState('');
    const [modificaData, setModificaData]=useState(new Date());*/


    const [inserimento, setInserimento] = useState<ins>({
        importo: "",
        v_simbolo: "",
        v_nome: "",
        v_sigla: "",
        nome_cat: "",
        descrizione: "",
        data: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        tag: [],
        idSpesa: ""
    });


    useEffect(() => {
        if (route.params != undefined) {
            setIsModifing(true);
            const { id: spesaId } = route.params;
            console.log('Spesa id passato: ' + spesaId);
            const spesa = database.getFirstSync(`SELECT * FROM spesa WHERE id=${spesaId};`);
            const tag_spesa = database.getAllSync(`SELECT nome_tag FROM tag_spesa WHERE id_spesa=${spesaId}`);
            const valuta = database.getFirstSync(`SELECT v.sigla, v.nome, v.simbolo FROM valuta AS v JOIN conto AS c on c.sigla=v.sigla WHERE c.id=${idConto};`);
            /*setModificaImporto(spesa.importo);
            setModificaData(spesa.data);
            setModificaDescrizione(spesa.descrizione);
            setModficaCategoria(spesa.categoria);
            setModificaTag(elencoTag);*/

            var elencoTag: string[] = [];
            for (const x of tag_spesa) {
                elencoTag.push(x.nome_tag);
            }


            setInserimento({
                importo: spesa.importo,
                v_simbolo: valuta.simbolo,
                v_nome: valuta.nome,
                v_sigla: valuta.sigla,
                nome_cat: spesa.categoria,
                descrizione: spesa.descrizione,
                data: (new Date(spesa.data)).toISOString(),
                tag: elencoTag,
                idSpesa: spesaId
            });



            /*inserimento.data=modificaData;
            inserimento.descrizione=modificaDescrizione;
            inserimento.importo=modificaImporto;
            inserimento.nome_cat=modificaCategoria;
            inserimento.tag=modificaTag;
            inserimento.v_sigla=valuta.sigla;
            inserimento.v_nome=valuta.nome;
            inserimento.v_simbolo=valuta.simbolo;*/

        }
    }, [route.params]); // Dependency array to ensure this effect runs only when route.params changes

    const data = [{ key: '1', component: <NuovaSpesaComponent isModifing={isModifing} inserimento={inserimento} database={database} idConto={idConto} /> }];


    const renderItem = ({ item }) => item.component;


    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            scrollEnabled
            nestedScrollEnabled
        />
    );
};


const styles = StyleSheet.create({
    box: {
        marginTop: 10,
        flex: 1
    },
    botton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#0057BB',
        borderRadius: 6,
        height: 45,
        width: 200,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    spesa_valuta: {
        flex: 1,
        marginVertical: 10,
        flexDirection: 'row',
        width: 304,
        alignSelf: 'center',
        borderColor: '#0057BB',
        borderWidth: 2,
        borderRadius: 4
    },
    testo_spesa: {
        fontFamily: 'minions-font',
        fontSize: 16,
        color: '#0057BB',
        borderColor: '#0057BB',
        width: 150,
        height: 60,
        textAlign: 'center',
        borderRightWidth: 2,
        backgroundColor: 'white'
    },
    spesa: {
        flex: 1,
        alignItems: 'center'
    },
    valuta: {
        flex: 1,
        alignItems: 'center',
        width: 200,
        height: 60,
    },
    picker: {
        fontFamily: 'minions-font',
        flex: 1,
        width: 150,
        textAlign: 'center',
        backgroundColor: 'white',
        color: '#0057BB',
    },
    scritte: {
        fontFamily: 'minions-font',
        fontSize: 20,
        color: '#0057BB',
        textAlign: 'center'
    },
    categorie: {
        backgroundColor: 'white',
        borderColor: '#0057BB',
        borderWidth: 2,
        borderRadius: 20,
        width: 370,
        paddingHorizontal: 7,
        marginVertical: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        flex: 1
    },
    separator: {
        height: 20
    },
    testo_categoria: {
        fontFamily: 'minions-font',
        textAlign: 'center',
        borderColor: '#0057BB',
        borderWidth: 1,
        borderRadius: 4,
        marginHorizontal: 1
    },
    immagine_categoria: {
        width: 70,
        height: 70
    },
    modal: {
        backgroundColor: 'white',
        color: '#0057BB',
        fontFamily: 'minions-font',
        justifyContent: 'center',
        flex: 1,
    },
    vista_modal: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    elementi_modal: {
        alignItems: 'center',
        backgroundColor: 'white',
        width: 300,
        alignSelf: 'center',
        borderColor: '#0057BB',
        borderWidth: 2,
        paddingVertical: 15
    },
    elementi_tag_modal: {
        width: 270,
        height: 180,
        alignSelf: 'center',
        marginTop: 20,
        borderColor: '#0057BB',
        borderWidth: 2,
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    scritte_popup: {
        fontFamily: 'minions-font',
        fontSize: 15,
        color: '#0057BB',
        textAlign: 'left'
    },
    scrittaData: {
        fontFamily: 'minions-font',
        textAlign: 'left',
        textAlignVertical: 'center',
        marginHorizontal: 10,
        color: '#0057BB',
        textShadowColor: 'white',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
        fontSize: 16
    },
    icone: {
        width: 50,
        height: 50
    },
    testo_bottone_tag: {
        backgroundColor: '#0057BB',
        color: 'white',
        fontFamily: 'minions-font',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: 100,
        height: 40
    },
    inputDescrizione: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderColor: '#0057BB',
        borderWidth: 2,
        borderRadius: 6,
        margin: 7,
        height: 100,
        textAlignVertical: 'top',
        padding: 10
    },
    containerCaricamento: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5E642',
    },
    textContainerCaricamento: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#3B3B3B',
    },
});

export default NuovaSpesa;