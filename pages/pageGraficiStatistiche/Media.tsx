
import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Media = ({ database }: { database: any }) => {
    const [opzione, setOpzione] = useState('Giorno');
    const [media, setMedia] = useState('0.000');

    const calcolaMedia = async (opzione: string) => {
        try {
            let query = '';
            if (opzione === 'Giorno') {
                query = 'SELECT ROUND(AVG(importo), 3) AS media FROM spesa WHERE date(data) = date("now")';
            } else if (opzione === 'Mese') {
                query = 'SELECT ROUND(AVG(importo), 3) AS media FROM spesa WHERE strftime("%Y-%m", data) = strftime("%Y-%m", "now")';
            } else if (opzione === 'Anno') {
                query = 'SELECT ROUND(AVG(importo), 3) AS media FROM spesa WHERE strftime("%Y", data) = strftime("%Y", "now")';
            }

            const result = await database.getFirstAsync(query);
            if (result && result.media !== null) {
                return result.media.toString();
            }
        } catch (error) {
            console.error("Errore durante il calcolo della media:", error);
        }
        return '0.000';
    };


    const onChange = async (opzione: string) => {
        setOpzione(opzione);
        const mediaCalcolata = await calcolaMedia(opzione);
        setMedia(mediaCalcolata);
    };


    useEffect(() => {
        const fetchInitialMedia = async () => {
            const mediaIniziale = await calcolaMedia(opzione);
            setMedia(mediaIniziale);
        };
        fetchInitialMedia();
    }, []);


    return (

        <View style={styles.containerMedia}>
            <Image
                style={{
                    position: 'absolute',
                    top: -screenHeight * 0.007,
                    left: -screenWidth * 0.05,
                }}
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
            <Text style={styles.risultatoSpesaMedia}> {media}  </Text>
            <Image
                style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                }}
                source={require('../../assets/Image/MiniPazzo.png')}
            />
        </View>);
};

export default Media;

const styles = StyleSheet.create({
    containerMedia: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#FEEC47',
        borderTopWidth: 1,
        borderColor: '#003366',
        width: screenWidth,
        height: screenHeight * 0.386
    },

    titleMedia: {
        fontSize: 20,
        marginBottom: 8,
        color: '#0057B8',
        fontFamily: 'fredoka-one',
        fontWeight: 'bold',
        marginTop: screenHeight * 0.02,
        paddingLeft: 10
        // marginTop: -screenHeight * (0.15)
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