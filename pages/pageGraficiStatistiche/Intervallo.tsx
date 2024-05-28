import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput, Pressable, Modal } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const CalendarButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} >
        <AntDesign name="calendar" size={24} color="white" />
    </TouchableOpacity>
);

const calcolaSpesaMinMax = (dataInizio, dataFine) => {
    const min = Math.floor(Math.random() * 100);
    const max = Math.floor(Math.random() * 100);
    const categoriaMax = Math.floor(Math.random() * 100);
    const categoriaMin = Math.floor(Math.random() * 100);
    return { min, max, categoriaMax, categoriaMin };
};

const Intervallo = () => {
    const [dataInizio, setDataInizio] = useState(new Date());
    const [dataFine, setDataFine] = useState(new Date());
    const [showDatePickerInizio, setShowDatePickerInizio] = useState(false);
    const [showDatePickerFine, setShowDatePickerFine] = useState(false);
    const [spesaMinima, setSpesaMinima] = useState(calcolaSpesaMinMax(new Date(), new Date()).min);
    const [spesaMassima, setSpesaMassima] = useState(calcolaSpesaMinMax(new Date(), new Date()).max);
    const [categoriaSpesaMassima, setCategoriaSpesaMassima] = useState(calcolaSpesaMinMax(new Date(), new Date()).categoriaMax);
    const [categoriaSpesaMinima, setCategoriaSpesaMinima] = useState(calcolaSpesaMinMax(new Date(), new Date()).categoriaMin);
    const [valuta, setValuta] = useState('€');
    const [modalVisibleMinimo, setModalVisibleMinimo] = useState(false);
    const [modalVisibleMassimo, setModalVisibleMassimo] = useState(false);

    const toggleDatePicker = (flag) => {
        if (flag === 1)
            setShowDatePickerInizio(!showDatePickerInizio);
        else
            setShowDatePickerFine(!showDatePickerFine);
    };

    const onChangeData = (flag, selectedDate) => {
        if (flag === 1) {
            const currentDate = selectedDate || dataInizio;
            setShowDatePickerInizio(false);
            setDataInizio(currentDate);
        } else {
            const currentDate = selectedDate || dataFine;
            setShowDatePickerFine(false);
            setDataFine(currentDate);
        }
        const { min, max, categoriaMin, categoriaMax } = calcolaSpesaMinMax(dataInizio, dataFine);
        setSpesaMinima(min);
        setSpesaMassima(max);
        setCategoriaSpesaMassima(categoriaMax);
        setCategoriaSpesaMinima(categoriaMin);
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
                        <Pressable onPress={() => toggleDatePicker(1)}>
                            <TextInput editable={false} style={styles.testoAreaCalendario} placeholder='data' value={dataFine.toLocaleDateString()} />
                        </Pressable>
                        <CalendarButton onPress={() => toggleDatePicker(2)} />
                    </View>
                    <Text style={styles.labelSpesa}>Spesa massima:</Text>
                    <Text style={styles.risultatoSpesaMedia}>{spesaMassima}  {valuta}</Text>
                    {showDatePickerFine && (
                        <DateTimePicker
                            value={dataInizio}
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
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleMinimo}
                        onRequestClose={() => {
                            setModalVisibleMinimo(!modalVisibleMinimo);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>{categoriaSpesaMinima}</Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisibleMinimo(!modalVisibleMinimo)}>
                                    <Text style={styles.textStyle}>Nascondi</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setModalVisibleMinimo(true)}>
                        <Text style={styles.textStyle}>Imm Cat</Text>
                    </Pressable>
                </View>
                <View style={[styles.contanerInernoCategoriaMinMax, { marginVertical: screenHeight * 0.04, }]}>
                    <Text style={styles.textElementDate}>Categoria per spesa minima:</Text>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisibleMassimo}
                        onRequestClose={() => {
                            setModalVisibleMassimo(!modalVisibleMassimo);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>{categoriaSpesaMassima}</Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisibleMassimo(!modalVisibleMassimo)}>
                                    <Text style={styles.textStyle}>Nascondi</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setModalVisibleMassimo(true)}>
                        <Text style={styles.textStyle}>Imm Cat</Text>
                    </Pressable>

                </View>

            </View>
        </View >
    );
};
export default Intervallo;

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
        fontSize: 18,
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
        fontSize: 16,
        color: '#FFF',
        fontFamily: 'fredoka-one',
        width: screenWidth * 0.23
    },

    labelSpesa: {
        fontSize: 16,
        color: '#0057B8', // Blu Minions
        marginTop: screenHeight * 0.01,
    },

    risultatoSpesaMedia: {
        fontSize: 16,
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