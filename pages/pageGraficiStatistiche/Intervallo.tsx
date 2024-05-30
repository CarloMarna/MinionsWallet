import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Pressable, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { calcolaSpesaMinMax, ottieniValuta } from '../../script/scriptStatisticheGrafici';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const CalendarButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} >
        <AntDesign name="calendar" size={screenWidth * 0.07} color="white" />
    </TouchableOpacity>
);

const ModalContent = ({ modalVisible, onClose, content }) => (
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

const Intervallo = ({ database }) => {
    const today = new Date();
    const [dataInizio, setDataInizio] = useState(new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()));
    const [dataFine, setDataFine] = useState(new Date());
    const [showDatePickerInizio, setShowDatePickerInizio] = useState(false);
    const [showDatePickerFine, setShowDatePickerFine] = useState(false);
    const [spesaMinima, setSpesaMinima] = useState(0);
    const [spesaMassima, setSpesaMassima] = useState(0);
    const [categoriaSpesaMassima, setCategoriaSpesaMassima] = useState('N/A');
    const [categoriaSpesaMinima, setCategoriaSpesaMinima] = useState('N/A');
    const [valuta, setValuta] = useState('');
    const [modalVisibleMinimo, setModalVisibleMinimo] = useState(false);
    const [modalVisibleMassimo, setModalVisibleMassimo] = useState(false);

    useEffect(() => {
        const fetchSpese = async () => {
            const { min, max, categoriaMin, categoriaMax } = await calcolaSpesaMinMax(database, dataInizio, dataFine);
            setSpesaMinima(min);
            setSpesaMassima(max);
            setCategoriaSpesaMinima(categoriaMin);
            setCategoriaSpesaMassima(categoriaMax);
            setValuta(await ottieniValuta(database))
        };

        fetchSpese();
    }, [database, dataInizio, dataFine]);

    const toggleDatePicker = (flag) => {
        if (flag === 1)
            setShowDatePickerInizio(!showDatePickerInizio);
        else
            setShowDatePickerFine(!showDatePickerFine);
    };

    const onChangeData = async (flag, selectedDate) => {
        if (flag === 1) {
            const currentDate = selectedDate || dataInizio;
            setShowDatePickerInizio(false);
            setDataInizio(currentDate);
        } else {
            const currentDate = selectedDate || dataFine;
            setShowDatePickerFine(false);
            setDataFine(currentDate);
        }
        const { min, max, categoriaMin, categoriaMax } = await calcolaSpesaMinMax(database, dataInizio, dataFine);
        setSpesaMinima(min);
        setSpesaMassima(max);
        setCategoriaSpesaMassima(categoriaMax);
        setCategoriaSpesaMinima(categoriaMin);
    };

    const toggleModal = (flag) => {
        if (flag === 1)
            setModalVisibleMinimo(!modalVisibleMinimo);
        else
            setModalVisibleMassimo(!modalVisibleMassimo);
    };

    return (
        <View style={{ flex: 1, alignItems: 'center' }} >
            <View style={[styles.containerDate]}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.textElementDate}>Data Inizio:</Text>
                    <View style={styles.areaCalendario}>
                        <Pressable onPress={() => toggleDatePicker(1)}>
                            <TextInput editable={false} style={styles.testoAreaCalendario} placeholder='data' value={dataInizio.toLocaleDateString()} />
                        </Pressable>
                        <CalendarButton onPress={() => toggleDatePicker(1)} />
                    </View>
                    <Text style={styles.labelSpesa}>Spesa minima:</Text>
                    <Text style={styles.risultatoSpesaMedia}>{spesaMinima}  {valuta}</Text>
                    {showDatePickerInizio && (
                        <DateTimePicker
                            value={dataInizio}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => onChangeData(1, selectedDate)}
                        />
                    )}
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={styles.textElementDate}>Data Fine:</Text>
                    <View style={styles.areaCalendario}>
                        <Pressable onPress={() => toggleDatePicker(2)}>
                            <TextInput editable={false} style={styles.testoAreaCalendario} placeholder='data' value={dataFine.toLocaleDateString()} />
                        </Pressable>
                        <CalendarButton onPress={() => toggleDatePicker(2)} />
                    </View>
                    <Text style={styles.labelSpesa}>Spesa massima:</Text>
                    <Text style={styles.risultatoSpesaMedia}>{spesaMassima}  {valuta}</Text>
                    {showDatePickerFine && (
                        <DateTimePicker
                            value={dataFine}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => onChangeData(2, selectedDate)}
                        />
                    )}
                </View>
            </View>
            <View style={styles.containerCategoriaMinMax}>
                <View style={styles.contanerInernoCategoriaMinMax}>
                    <Text style={styles.textElementDate}>Categoria per spesa massima:</Text>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => toggleModal(1)}>
                        <Text style={styles.textStyle}>Imm Cat</Text>
                    </Pressable>
                </View>
                <View style={[styles.contanerInernoCategoriaMinMax, { marginVertical: screenHeight * 0.04, }]}>
                    <Text style={styles.textElementDate}>Categoria per spesa minima:</Text>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => toggleModal(2)}>
                        <Text style={styles.textStyle}>Imm Cat</Text>
                    </Pressable>
                </View>
            </View>
            <ModalContent
                modalVisible={modalVisibleMinimo}
                onClose={() => setModalVisibleMinimo(false)}
                content={categoriaSpesaMinima}
            />
            <ModalContent
                modalVisible={modalVisibleMassimo}
                onClose={() => setModalVisibleMassimo(false)}
                content={categoriaSpesaMassima}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    tabBarInferiori: {
        flex: 1,
        paddingTop: screenHeight * 0.01,
    },

    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FEEC47',

    },

    containerDate: {
        marginTop: screenHeight * 0.02,
        fontFamily: 'fredoka-one',
        flexDirection: 'row',
    },

    textElementDate: {
        fontSize: screenWidth * 0.05,
        marginBottom: screenHeight * 0.01,
        color: '#0057B8',
        fontFamily: 'fredoka-one'
    },

    areaCalendario: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0057B8',
        paddingVertical: screenHeight * 0.01,
        paddingHorizontal: screenWidth * 0.03,
        width: screenWidth * 0.35,
        borderRadius: 5,
    },

    testoAreaCalendario: {
        fontSize: screenWidth * 0.04,
        color: '#FFF',
        fontFamily: 'fredoka-one',
        width: screenWidth * 0.23
    },

    labelSpesa: {
        fontSize: screenWidth * 0.04,
        color: '#0057B8', // Blu Minions
        marginTop: screenHeight * 0.01,
    },

    risultatoSpesaMedia: {
        fontSize: screenWidth * 0.04,
        marginTop: 4,
        color: '#0057B8',
        fontFamily: 'fredoka-one'
    },

    containerCategoriaMinMax: {
        marginTop: screenHeight * 0.03
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

    //Categoria Pop Up
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
        padding: 10,
        elevation: 2,
    },

    buttonOpen: {
        backgroundColor: '#0057B8',
    },

    buttonClose: {
        backgroundColor: '#0057B8',
    },

    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'fredoka-one'
    },

    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'fredoka-one'
    }
});
export default Intervallo;
