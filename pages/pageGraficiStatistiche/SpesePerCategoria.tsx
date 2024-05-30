import * as React from 'react';
import { FlatList, Text, View, Image, Dimensions, StyleSheet, ActivityIndicator, ImageComponent } from 'react-native';
import { useState, useEffect } from 'react';
import { caricaSpesePerCategoriaSezione } from '../../script/scriptStatisticheGrafici';
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
};

const MinionComponent = () => {
    return (
        <View style={styles.minionsContainer}>
            <View style={styles.minion}>
                <Image source={require('../../assets/Image/13.png')} style={styles.imageSpeseList} />
            </View>
            <View style={styles.minion}>
                <Image source={require('../../assets/Image/12.png')} style={styles.imageSpeseList} />
            </View>
        </View>
    );
};

const SpesePerCategoria = ({ database }: { database: any }) => {
    const [spesaCat, setSpesCat] = useState<Array<SpesaCategoriaType>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [orientation, setOrientation] = useState('portrait');
    const [screenDimensions, setScreenDimensions] = useState({
        screenHeight: Dimensions.get('window').height,
        screenWidth: Dimensions.get('window').width
    });

    useEffect(() => {
        const caricaSpese = async () => {
            const spesePerCategoria = await caricaSpesePerCategoriaSezione(database);
            setSpesCat(spesePerCategoria);
            setIsLoading(true);
        };
        caricaSpese();
    }, []);




    const detectOrientation = () => {
        const { height, width } = Dimensions.get('window');
        if (width > height) {
            setOrientation('landscape');
        } else {
            setOrientation('portrait');
        }
        setScreenDimensions({ screenHeight: height, screenWidth: width });
    };

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', detectOrientation);
        detectOrientation();
        return () => {
            subscription.remove();
        };
    }, []);

    if (!isLoading) {
        return (
            <View style={styles.containerCaricamento}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.textContainerCaricamento}>Caricamento...</Text>
            </View>
        );
    }
    //<> ci permette di restituire più elementi senza metterli in una "div"

    return (
        <View style={styles.container}>
            {spesaCat.length === 0 ? (
                <>
                    {orientation === 'portrait' ? (
                        <View style={styles.noSpeseContainer}>
                            <Text style={styles.noSpeseText}>Nessuna spesa disponibile</Text>
                            <View style={styles.containerImageNoSpesa}>
                                <Image source={require('../../assets/Image/miniSorprese.png')} style={styles.imageSpese} />
                            </View>

                        </View>) :
                        <View style={[styles.noSpeseContainer, { flexDirection: 'row' }]}>
                            <Text style={styles.noSpeseText}>Nessuna spesa disponibile</Text>
                        </View>
                    }
                </>
            ) : (
                <>
                    <FlatList
                        ListHeaderComponent={
                            <Text style={styles.textSchermataSpeseCategoria}>Divisione Spese Per Categoria:</Text>
                        }
                        data={spesaCat}
                        renderItem={renderSpeseCategoria}
                        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
                        ListFooterComponent={() => (orientation !== 'portrait' ? <MinionComponent /> : null)}
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
        backgroundColor: '#FEEC47', // Giallo chiaro
    },
    textSchermataSpeseCategoria: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: screenHeight * 0.02,
        color: '#0057B8',
        fontFamily: 'fredoka-one',
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
        color: '#0057B8', //'#2C3E50',
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
        paddingBottom: screenHeight * 0.005,
        justifyContent: 'center',
        alignItems: 'center',
    },
    minion: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        width: screenWidth * 0.3,
        height: screenHeight * 0.2,
        resizeMode: 'contain',
    },

    containerImageNoSpesa: {
        position: 'absolute',
        bottom: 0
    },

    imageSpese: {
        width: screenWidth * 0.9,
        height: screenHeight * 0.25,
        resizeMode: 'contain',
    },
});

export default SpesePerCategoria;
