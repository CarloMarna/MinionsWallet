import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, Image, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { caricaSpesePerCategoriaSezione } from '../../script/scriptStatisticheGrafici';
import { getImageFromPath } from '../../script/minionImage';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

type SpesaCategoriaType = {
    categoria: string,
    percentuale: number,
    path: string
};

const renderSpeseCategoria = ({ item }: { item: SpesaCategoriaType }) => {
    const path = getImageFromPath(item.path);
    return (
        <>
            <View style={styles.rigaSpesa}>
                <View style={styles.categoriaSpesa}>
                    <Image style={[{ width: 50, height: 50 }]} source={path} />
                </View>
                <View style={styles.percentualeCategorie}>
                    <Text style={styles.spesaCategoriaText}>{item.categoria}</Text>
                    <Text style={[styles.spesaCategoriaText, styles.spesaCategoriaTextPercentuale]}>{item.percentuale}%</Text>
                </View>
            </View>
        </>
    );
};

const MinionComponent = () => (
    <View style={styles.minionsContainer}>
        <Image source={require('../../assets/Image/stupid.png')} style={styles.imageSpeseList} />
    </View>
);

const SpesePerCategoria = ({ database, idConto }) => {
    const [spesaCat, setSpesaCat] = useState<SpesaCategoriaType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [orientation, setOrientation] = useState('portrait');

    useEffect(() => {
        const caricaSpese = async () => {
            const spesePerCategoria = await caricaSpesePerCategoriaSezione(database, idConto);
            setSpesaCat(spesePerCategoria);
            setIsLoading(false);
        };
        caricaSpese();
    }, [database]);

    useEffect(() => {
        const detectOrientation = () => {
            const { height, width } = Dimensions.get('window');
            setOrientation(width > height ? 'landscape' : 'portrait');
        };

        const subscription = Dimensions.addEventListener('change', detectOrientation);
        detectOrientation();
        return () => subscription.remove();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Caricamento...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {spesaCat.length === 0 ? (
                <View style={[styles.noSpeseContainer, orientation === 'landscape' && { flexDirection: 'row' }]}>
                    <Text style={styles.noSpeseText}>Nessuna spesa disponibile</Text>
                    {orientation === 'portrait' && (
                        <View style={styles.noSpeseImageContainer}>
                            <Image source={require('../../assets/Image/miniSorprese.png')} style={styles.noSpeseImage} />
                        </View>
                    )}
                </View>
            ) : (
                <>
                    <FlatList
                        ListHeaderComponent={<Text style={styles.headerText}>Divisione Spese Per Categoria:</Text>}
                        data={spesaCat}
                        renderItem={renderSpeseCategoria}
                        style={styles.flatList}
                        ListFooterComponent={orientation !== 'portrait' ? <MinionComponent /> : null}
                    />
                    {orientation === 'portrait' && <MinionComponent />}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEEC47',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: screenHeight * 0.02,
        color: '#0057B8',
        fontFamily: 'fredoka-one',
    },
    spesaCategoriaText: {
        fontSize: 16,
        color: '#0057B8',
        fontFamily: 'fredoka-one',
    },
    spesaCategoriaTextPercentuale: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    listSeparator: {
        height: 1,
        backgroundColor: '#ccc',
    },
    minionsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5E642',
    },
    loadingText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#3B3B3B',
    },
    noSpeseContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noSpeseText: {
        color: 'red',
        fontSize: 20,
    },
    imageSpeseList: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.22,
        resizeMode: 'contain',
    },
    noSpeseImageContainer: {
        position: 'absolute',
        bottom: 0,
    },
    noSpeseImage: {
        width: screenWidth * 0.9,
        height: screenHeight * 0.25,
        resizeMode: 'contain',
    },

    rigaSpesa: {
        flexDirection: 'row',
        backgroundColor: '#fff',
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

    flatList: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20
    },

    percentualeCategorie: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default SpesePerCategoria;
