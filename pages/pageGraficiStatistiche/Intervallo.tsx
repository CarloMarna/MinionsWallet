import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, TextInput, Pressable, ActivityIndicator, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { calcolaSpesaMinMax, ottieniValuta } from '../../script/scriptStatisticheGrafici';
import { getImageFromPath } from '../../script/minionImage';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const CalendarButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} >
        <AntDesign name="calendar" size={screenWidth * 0.07} color="white" />
    </TouchableOpacity>
);

const ModalContent = ({ modalVisible, onClose, content }) => {
    if (content === 'N/A') {
        return null;
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onClose}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{content}</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={onClose}>
                        <Text style={styles.textStyle}>Nascondi</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const Intervallo = ({ database }) => {

    const [dataInizio, setDataInizio] = useState(new Date());
    const [dataFine, setDataFine] = useState(new Date());
    const [showDatePickerInizio, setShowDatePickerInizio] = useState(false);
    const [showDatePickerFine, setShowDatePickerFine] = useState(false);
    const [spesaMinima, setSpesaMinima] = useState(0);
    const [spesaMassima, setSpesaMassima] = useState(0);
    const [categoriaSpesaMassima, setCategoriaSpesaMassima] = useState('');
    const [categoriaSpesaMinima, setCategoriaSpesaMinima] = useState('');
    const [pathMin, setPathMin] = useState('');
    const [pathMax, setPathMax] = useState('');
    const [valuta, setValuta] = useState('');
    const [modalVisibleMinimo, setModalVisibleMinimo] = useState(false);
    const [modalVisibleMassimo, setModalVisibleMassimo] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const fetchSpese = async () => {
            const { min, max, categoriaMin, categoriaMax, pathMin, pathMax } = await calcolaSpesaMinMax(database, dataInizio, dataFine);
            setValuta(await ottieniValuta(database));
            setSpesaMinima(min);
            setSpesaMassima(max);
            setCategoriaSpesaMinima(categoriaMin);
            setCategoriaSpesaMassima(categoriaMax);
            setPathMax(pathMax);
            setPathMin(pathMin);
            setIsLoading(true);
        };
        fetchSpese();
    }, [database, dataInizio, dataFine]);

    const toggleDatePicker = (flag) => {
        if (flag === true) setShowDatePickerInizio(!showDatePickerInizio);
        else setShowDatePickerFine(!showDatePickerFine);
    };

    const toggleModal = (flag) => {
        if (flag === true) setModalVisibleMinimo(!modalVisibleMinimo);
        else setModalVisibleMassimo(!modalVisibleMassimo);
    };

    const onChangeData = (flag, selectedDate) => {
        if (flag === true) {
            const currentDate = selectedDate || dataInizio;
            setShowDatePickerInizio(false);
            setDataInizio(currentDate);
        } else {
            const currentDate = selectedDate || dataFine;
            setShowDatePickerFine(false);
            setDataFine(currentDate);
        }
    };

    const imageToShowMin = pathMin ? getImageFromPath(pathMin) : null;
    const imageToShowMax = pathMax ? getImageFromPath(pathMax) : null;

    if (!isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, alignItems: 'center' }} >
            <View style={[styles.containerDate]}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.textElementDate}>Data Inizio:</Text>
                    <View style={styles.areaCalendario}>
                        <Pressable onPress={() => toggleDatePicker(true)}>
                            <TextInput editable={false} style={styles.testoAreaCalendario} placeholder='data' value={dataInizio.toLocaleDateString()} />
                        </Pressable>
                        <CalendarButton onPress={() => toggleDatePicker(true)} />
                    </View>
                    <Text style={styles.labelSpesa}>Spesa minima:</Text>
                    <Text style={styles.risultatoSpesaMedia}>{spesaMinima}{valuta}</Text>
                    {showDatePickerInizio && (
                        <DateTimePicker
                            value={dataInizio}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => onChangeData(true, selectedDate)}
                        />
                    )}
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.textElementDate}>Data Fine:</Text>
                    <View style={styles.areaCalendario}>
                        <Pressable onPress={() => toggleDatePicker(false)}>
                            <TextInput editable={false} style={styles.testoAreaCalendario} placeholder='data' value={dataFine.toLocaleDateString()} />
                        </Pressable>
                        <CalendarButton onPress={() => toggleDatePicker(false)} />
                    </View>
                    <Text style={styles.labelSpesa}>Spesa massima:</Text>
                    <Text style={styles.risultatoSpesaMedia}>{spesaMassima}{valuta}</Text>
                    {showDatePickerFine && (
                        <DateTimePicker
                            value={dataFine}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => onChangeData(false, selectedDate)}
                        />
                    )}
                </View>
            </View>
            <View style={styles.containerCategoriaMinMax}>
                <View style={styles.contanerInernoCategoriaMinMax}>
                    <Text style={styles.textElementDate}>Categoria per spesa massima:</Text>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => toggleModal(true)}>
                        {imageToShowMax ? (
                            <Image source={imageToShowMax} style={{ width: screenWidth * 0.17, height: screenHeight * 0.07, resizeMode: 'contain' }} />
                        ) : (
                            <Text style={{ color: '#FF0000', }}>N/A</Text>
                        )}
                    </Pressable>
                </View>
                <View style={[styles.contanerInernoCategoriaMinMax, { marginVertical: screenHeight * 0.018, }]}>
                    <Text style={styles.textElementDate}>Categoria per spesa minima:</Text>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => toggleModal(false)}>
                        {imageToShowMin ? (
                            <Image source={imageToShowMin} style={{ width: screenWidth * 0.17, height: screenHeight * 0.07, resizeMode: 'contain' }} />
                        ) : (
                            <Text style={{ color: '#FF0000' }}>N/A</Text>
                        )}
                    </Pressable>
                </View>
            </View>
            <ModalContent
                modalVisible={modalVisibleMinimo}
                onClose={() => setModalVisibleMinimo(false)}
                content={categoriaSpesaMassima}
            />
            <ModalContent
                modalVisible={modalVisibleMassimo}
                onClose={() => setModalVisibleMassimo(false)}
                content={categoriaSpesaMinima}
            />
        </View >
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: screenHeight * 0.32
    },
    containerDate: {
        marginTop: screenHeight * 0.02,
        flexDirection: 'row',
    },
    textElementDate: {
        fontSize: screenWidth * 0.05,
        marginBottom: screenHeight * 0.01,
        color: '#0057B8',
    },
    areaCalendario: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0057B8',
        paddingVertical: screenHeight * 0.01,
        paddingHorizontal: screenWidth * 0.03,
        width: screenWidth * 0.39,
        borderRadius: 5,
    },
    testoAreaCalendario: {
        textAlign: 'center',
        fontSize: screenWidth * 0.045,
        color: '#FFF',
        width: screenWidth * 0.27
    },
    labelSpesa: {
        fontSize: screenWidth * 0.04,
        color: '#0057B8',
        marginTop: screenHeight * 0.01,
    },
    risultatoSpesaMedia: {
        fontSize: screenWidth * 0.04,
        marginTop: 4,
        color: '#0057B8',
    },
    containerCategoriaMinMax: {
        marginTop: screenHeight * 0.02
    },
    contanerInernoCategoriaMinMax: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: screenHeight * 0.01,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: screenWidth * 0.01,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: 'white',
    },
    buttonClose: {
        backgroundColor: '#0057B8',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: screenWidth * 0.05
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: screenWidth * 0.06
    }
});

export default Intervallo;

