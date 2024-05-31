import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { calcolaMedia, ottieniValuta } from '../../script/scriptStatisticheGrafici';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Media = ({ database }) => {
    const [opzione, setOpzione] = useState('Giorno');
    const [media, setMedia] = useState('0.000');
    const [valuta, setValuta] = useState('0.000');

    const onChange = async (opzione) => {
        setOpzione(opzione);
        const mediaCalcolata = await calcolaMedia(database, opzione);
        setMedia(mediaCalcolata);
    };

    useEffect(() => {
        const fetchInizialelMedia = async () => {
            const [mediaIniziale, valuta] = await Promise.all([calcolaMedia(database, opzione), ottieniValuta(database)]);
            setMedia(mediaIniziale);
            setValuta(valuta);
        };
        fetchInizialelMedia();
    }, [database, opzione]);

    return (
        <View style={styles.containerMedia}>
            <Image
                style={styles.backgroundImage}
                source={require('../../assets/Image/miniAppesi.png')}
            />
            <Text style={styles.titleMedia}>Calcola Spesa Media al:</Text>
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
            <Text style={styles.risultatoSpesaMedia}>{media}{valuta}</Text>
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
        backgroundColor: '#FEEC47',
        borderTopWidth: 1,
        borderColor: '#003366',
        width: screenWidth,
        height: screenHeight * 0.386,
        position: 'relative'
    },
    backgroundImage: {
        position: 'absolute',
        top: -screenHeight * 0.002,
        left: 0,
        width: screenWidth * 0.27,
        height: screenHeight * 0.35,
        resizeMode: 'contain'
    },
    titleMedia: {
        fontSize: screenWidth * 0.04,
        marginBottom: 8,
        color: '#0057B8',
        fontFamily: 'fredoka-one',
        fontWeight: 'bold',
        marginTop: screenHeight * 0.02,
        paddingLeft: 10
    },
    picker: {
        height: screenHeight * 0.05,
        width: screenWidth * 0.4,
        marginBottom: 20,
        color: '#0057B8',
    },

    pickerItem: {
        fontFamily: 'fredoka-one',
    },

    risultatoSpesaMedia: {
        fontSize: screenHeight * 0.024,
        marginTop: 4,
        color: '#0057B8',
        fontFamily: 'fredoka-one'
    },
    miniPazzoImage: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: screenWidth * 0.40,
        height: screenHeight * 0.18,
        resizeMode: 'contain'

    }
});

export default Media;
