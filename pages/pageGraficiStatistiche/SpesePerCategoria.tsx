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
        <View style={styles.spesaCategoriaContainer}>
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
                { categoria: 'Banane:', percentuale: 30 },
                { categoria: 'Scatti in giro:', percentuale: 20 },
                { categoria: 'Cacce al tesoro:', percentuale: 15 },
                { categoria: 'Gelato:', percentuale: 100 },
                { categoria: 'Gadget:', percentuale: 5 },
                { categoria: 'Imposta del boss:', percentuale: 10 },
                { categoria: 'Regali:', percentuale: 5 },
                { categoria: 'Gadget:', percentuale: 5 },
                { categoria: 'Imposta del boss:', percentuale: 10 },
                { categoria: 'Banane:', percentuale: 30 },
                { categoria: 'Scatti in giro:', percentuale: 20 },
                { categoria: 'Cacce al tesoro:', percentuale: 15 },
                { categoria: 'Gelato:', percentuale: 100 },
                { categoria: 'Gadget:', percentuale: 5 },
                { categoria: 'Imposta del boss:', percentuale: 10 },
                { categoria: 'Regali:', percentuale: 5 },
                { categoria: 'Gadget:', percentuale: 5 },
                { categoria: 'Imposta del boss:', percentuale: 10 },
            ];
            setSpesCat(spese);
        };
        caricaSpesePerCategoria();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.speseContainer}>
                <Text style={styles.textSchermataSpeseCategoria}>Divisione Spese Per Categoria:</Text>
                <FlatList
                    style={styles.spesaCategoriaList}
                    data={spesaCat}
                    renderItem={renderSpeseCategoria}
                    ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                />
            </View>
            <View style={styles.minionsContainer}>
                <View style={styles.minion}>
                    <Image source={require('../../assets/Image/13.png')} />
                </View>
                <View style={styles.minion}>
                    <Image source={require('../../assets/Image/12.png')} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEEC47', // Giallo chiaro
    },
    speseContainer: {
        flex: 8,
    },
    textSchermataSpeseCategoria: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: screenHeight * 0.02,
        color: '#0057B8',
        fontFamily: 'fredoka-one',
    },
    spesaCategoriaList: {
        marginTop: screenHeight * 0.012,
    },
    spesaCategoriaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: screenHeight * 0.013,
        borderBottomWidth: 1,
        borderBottomColor: '#0057B8',
    },
    spesaCategoriaText: {
        fontSize: 16,
        color: '#0057B8',//'#2C3E50', 
        fontFamily: 'fredoka-one',
    },
    spesaCategoriaTextPercentuale: {
        fontWeight: 'bold',
    },
    listSeparator: {
        height: 1,
        backgroundColor: '#ccc',
    },
    minionsContainer: {
        flexDirection: 'row',
        flex: 1.36,
        paddingBottom: screenHeight * 0.005
    },
    minion: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SpesePerCategoria;
