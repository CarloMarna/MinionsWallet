
import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Media = () => {
    const [opzione, setOpzione] = useState('Giorno');

    const calcolaMedia = (opzione) => {
        let mediaCalcolata = 0;
        if (opzione === 'Giorno') {
            mediaCalcolata = 50;
        } else if (opzione === 'Mese') {
            mediaCalcolata = 150;
        } else if (opzione === 'Anno') {
            mediaCalcolata = 1000;
        }
        return mediaCalcolata;
    };

    const onChange = (opzione) => {
        setOpzione(opzione);
        const mediaCalcolata = calcolaMedia(opzione);
        setMedia(mediaCalcolata);
    };

    const [media, setMedia] = useState(calcolaMedia('Giorno'));

    return (

        <View style={styles.containerMedia}>
            <Image
                style={{ marginTop: -screenHeight * 0.07, }}
                source={require('../../assets/Image/10.png')}
            />
            <Text style={styles.titleMedia}>Calcola Spesa Media al:</Text>
            <Picker
                selectedValue={opzione}
                onValueChange={(itemValue) => onChange(itemValue)}
                style={styles.tendinaMedia}
            >
                <Picker.Item label="Giorno" value="Giorno" />
                <Picker.Item label="Mese" value="Mese" />
                <Picker.Item label="Anno" value="Anno" />
            </Picker>
            <Text style={styles.risultatoSpesaMedia}> {media} </Text>
        </View>);
};

export default Media;

const styles = StyleSheet.create({
    containerMedia: {
        flex: 1.1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEEC47',
        borderTopWidth: 1,
        borderColor: '#003366',
        width: screenWidth * 0.9
    },

    titleMedia: {
        fontSize: 20,
        marginBottom: 10,
        color: '#0057B8',
        fontFamily: 'fredoka-one'
    },

    tendinaMedia: {
        height: 50,
        width: 200,
        marginBottom: 20,
        color: '#0057B8',
    },

    risultatoSpesaMedia: {
        fontSize: 16,
        marginTop: 4,
        color: '#0057B8',
        fontFamily: 'fredoka-one'
    },
});