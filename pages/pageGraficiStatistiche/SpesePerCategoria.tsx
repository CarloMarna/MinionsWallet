import * as React from 'react';
import { FlatList, Text, View, Image, Dimensions, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';


const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

type SpesaCategoriaType = {
    categoria: string,
    percentuale: number
}

const renderSpeseCategoria = ({ item }: { item: SpesaCategoriaType }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={styles.spesaCategoriaText}>{item.categoria}</Text>
            <Text style={[styles.spesaCategoriaText, styles.spesaCategoriaTextPercentuale]}>{item.percentuale}%</Text>
        </View>
    )
}

const SpesePerCategoria = () => {
    const [spesaCat, setSpesCat] = useState<Array<SpesaCategoriaType>>([]);
    useEffect(() => {
        const caricaSpesePerCategoria = () => {
            const spese = [
                { categoria: 'Alimentari:', percentuale: 30 },
                { categoria: 'Trasporti:', percentuale: 20 },
                { categoria: 'Svago:', percentuale: 15 },
                { categoria: 'Abbigliamento:', percentuale: 100 },
                { categoria: 'Assicurazioni:', percentuale: 5 },
                { categoria: 'Imposte:', percentuale: 10 },
                { categoria: 'Regali:', percentuale: 5 },
                { categoria: 'Assicurazioni:', percentuale: 5 },
                { categoria: 'Imposte:', percentuale: 10 },
                { categoria: 'Alimentari:', percentuale: 30 },
                { categoria: 'Trasporti:', percentuale: 20 },
                { categoria: 'Svago:', percentuale: 15 },
                { categoria: 'Abbigliamento:', percentuale: 100 },
                { categoria: 'Assicurazioni:', percentuale: 5 },
                { categoria: 'Imposte:', percentuale: 10 },
                { categoria: 'Regali:', percentuale: 5 },
                { categoria: 'Assicurazioni:', percentuale: 5 },
                { categoria: 'Imposte:', percentuale: 10 },
            ];
            setSpesCat(spese);
        };
        caricaSpesePerCategoria();
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: '#0057B8' }}>
            <View style={{ flex: 8, }}>
                <Text style={styles.textSchermataSpeseCategoria}>Divisione Spese Per Categoria:</Text>
                <FlatList
                    style={styles.spesaCategoriaS}
                    data={spesaCat}
                    renderItem={renderSpeseCategoria}
                    ItemSeparatorComponent={() => <View style={styles.listSep} />}
                />
            </View>
            <View style={{ flexDirection: 'row', flex: 1.35 }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Image source={require('../../assets/Image/13.png')} />
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Image source={require('../../assets/Image/12.png')} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textSchermataSpeseCategoria: {
        textAlign: 'center',
        marginTop: screenHeight * 0.010,
        fontFamily: 'fredoka-one',
        fontSize: 18,
        color: '#FEEC47',
        fontWeight: 'bold'
    },

    spesaCategoriaS: {
        marginVertical: screenHeight * 0.02,
        marginHorizontal: screenWidth * 0.06,
        padding: screenHeight * 0.01,
    },

    spesaCategoriaText: {
        fontSize: 19,
        color: '#FEEC47',
        fontFamily: 'fredoka-one'
    },

    spesaCategoriaTextPercentuale: {
        fontWeight: 'bold',
        borderWidth: 1,
        borderRadius: 10,
        width: screenWidth * 0.15,
        textAlign: 'center',
        backgroundColor: '#003366'
    },

    listSep: {
        height: 8,
    },
});

export default SpesePerCategoria;  