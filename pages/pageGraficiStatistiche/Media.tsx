import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { calcolaMedia, ottieniValuta } from '../../script/scriptStatisticheGrafici';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Media = ({ database, idConto }: { database: any, idConto: number }) => {
    const [opzione, setOpzione] = useState('Giorno');
    const [media, setMedia] = useState('');
    const [valuta, setValuta] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const onChange = async (opzione) => {
        setOpzione(opzione);
        setIsLoading(true);
        const mediaCalcolata = await calcolaMedia(database, opzione, idConto);
        setMedia(mediaCalcolata);
        setIsLoading(false);
    };

    useEffect(() => {
        const fetchInizialeMedia = async () => {
            const mediaIniziale = await calcolaMedia(database, opzione, idConto);
            const valuta = await ottieniValuta(database, idConto);
            setMedia(mediaIniziale);
            setValuta(valuta);
            setIsLoading(false);
        };
        fetchInizialeMedia();
    }, [database, idConto]);

    return (
        <View style={styles.containerMedia}>
            <Image
                style={styles.backgroundImage}
                source={require('../../assets/Image/miniAppesi.png')}
            />
            <Text style={styles.titleMedia}>Calcola Spesa Media al:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={opzione}
                    onValueChange={onChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="Giorno" value="Giorno" />
                    <Picker.Item label="Mese" value="Mese" />
                    <Picker.Item label="Anno" value="Anno" />
                </Picker>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#0000ff" />
                        <Text style={styles.textCaricamento}>Caricamento...</Text>
                    </View>
                ) : (
                    <Text style={styles.risultatoSpesaMedia}>{media}{valuta}</Text>
                )}
            </View>
            <Image
                style={styles.miniPazzoImage}
                source={require('../../assets/Image/MiniPazzo.png')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    containerMedia: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFF9C4',
        borderTopWidth: 1,
        borderColor: '#003366',
        width: screenWidth,
        height: screenHeight * 0.386,
        position: 'relative',
        paddingTop: screenHeight * 0.02,
    },
    backgroundImage: {
        position: 'absolute',
        top: -screenHeight * 0.002,
        left: 0,
        width: screenWidth * 0.27,
        height: screenHeight * 0.35,
        resizeMode: 'contain',
    },
    titleMedia: {
        fontSize: screenWidth * 0.05,
        marginBottom: 8,
        color: '#0057B8',
        fontFamily: 'fredoka-one',
        fontWeight: 'bold',
        paddingLeft: 10,
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        padding: 10,
        elevation: 1.3,
    },
    picker: {
        height: screenHeight * 0.05,
        width: screenWidth * 0.4,
        color: '#0057B8',
    },
    pickerItem: {
        fontFamily: 'fredoka-one',
    },
    risultatoSpesaMedia: {
        fontSize: screenHeight * 0.03,
        marginTop: 4,
        color: '#0057B8',
        fontFamily: 'fredoka-one',
        fontWeight: 'bold',
    },
    miniPazzoImage: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: screenWidth * 0.40,
        height: screenHeight * 0.18,
        resizeMode: 'contain',
    },
    textCaricamento: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#4682B4',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Media;
