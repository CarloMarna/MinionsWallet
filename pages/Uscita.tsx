import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Platform, FlatList, Modal, Button, Alert, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
const Uscita = ({ navigation, database, idConto, username }) => {


    const [total, setTotal] = useState(100);
    const [category, setCategory] = useState('Tutte');
    const [startDate, setStartDate] = useState(new Date('2024-01-01'));
    const [endDate, setEndDate] = useState(new Date('2024-12-31'));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [categories, setCategories] = useState([]);
    const [spese, setSpese] = useState([]);
    const [valuta, setValuta] = useState('EUR');
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [tagModal, setTagModal] = useState([]);


    const fetchCategories = async () => {
        try {
            const result = await database.getAllAsync(`SELECT nome FROM categoria`);
            setCategories(result);
        } catch (error) {
            console.error("Errore nel recupero delle categorie:", error);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, [database]);


    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const calculateTotal = async () => {
        try {
            let query2 = "SELECT sigla FROM conto where id=?";
            let params2 = [idConto];
            const result3 = await database.getFirstAsync(query2, params2);
            let query3 = "SELECT simbolo FROM valuta where sigla=?";
            let params3 = [result3.sigla];
            const result4 = await database.getFirstAsync(query3, params3);
            setValuta(result4.simbolo);
            if (category === 'Tutte') {
                let query = "SELECT SUM(importo) AS total FROM spesa WHERE data < ? AND data > ? AND id_conto=?";
                let params = [formatDate(endDate), formatDate(startDate), idConto];
                const result1 = await database.getAllAsync(query, params);
                setTotal(result1[0].total || 0);
            } else {
                let query = "SELECT SUM(importo) AS total FROM spesa WHERE data < ? AND data > ? AND categoria = ? AND id_conto=?";
                let params = [formatDate(endDate), formatDate(startDate), category, idConto];
                const result2 = await database.getAllAsync(query, params);
                setTotal(result2[0].total || 0);
            }

        } catch (error) {
            console.error("Errore il calcolo delle uscite: ", error);
        }
    };


    calculateTotal();
    useEffect(() => {
        calculateTotal();
    }, [database, category, startDate, endDate]);


    const fetchSpese = async () => {
        try {
            let query;
            let params;

            if (category === 'Tutte') {
                query = "SELECT importo, data, categoria, descrizione,id FROM spesa WHERE data <= ? AND data >= ? AND id_conto=?";
                params = [formatDate(endDate), formatDate(startDate), idConto];
            } else {
                query = "SELECT importo, data, categoria, descrizione,id FROM spesa WHERE data <= ? AND data >= ? AND categoria = ? AND id_conto=?";
                params = [formatDate(endDate), formatDate(startDate), category, idConto];
            }

            const result = await database.getAllAsync(query, params);
            setSpese(result);


        } catch (error) {
            console.error("Errore nel recupero delle spese:", error);
        }
    };
    useEffect(() => {

        fetchSpese();
    }, [database, category, startDate, endDate]);





    const toggleStartDatePicker = () => {
        setShowStartPicker(!showStartPicker);
    };

    const toggleEndDatePicker = () => {
        setShowEndPicker(!showEndPicker);
    };

    const onStartChange = ({ type }, selectedDate) => {
        if (type === "set") {
            const currentDate = selectedDate || startDate;
            setStartDate(currentDate);
            if (Platform.OS === "android") {
                toggleStartDatePicker();
            }
        } else {
            toggleStartDatePicker();
        }
    };

    const onEndChange = ({ type }, selectedDate) => {
        if (type === "set") {
            const currentDate = selectedDate || endDate;
            setEndDate(currentDate);
            if (Platform.OS === "android") {
                toggleEndDatePicker();
            }
        } else {
            toggleEndDatePicker();
        }
    };

    const modificaSpesa = (spesaToModify) => {

        navigation.navigate('NuovaSpesa', { id: spesaToModify.id });
    }
    const deleteSpesa = async (spesaToDelete) => {
        try {


            const deleteQuery = `DELETE FROM spesa WHERE id = ${spesaToDelete.id}`;
            await database.execAsync(deleteQuery);


            fetchSpese();
            const result = await database.getAllAsync(
                "Select id from spesa where categoria= ? order by id asc", [spesaToDelete.categoria]
            );

            if (result.length === 0) {

                const deleteCategoryQuery = `DELETE FROM categoria WHERE nome = '${spesaToDelete.categoria}'`;
                await database.execAsync(deleteCategoryQuery);

                fetchCategories();
            }


            toggleModal();
        } catch (error) {
            console.error("Errore durante l'eliminazione della spesa:", error);
        }
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    const takeTag = async (selectedItem) => {

        let i = 115;
        const tags = await database.getAllAsync(
            "Select nome_tag from tag_spesa where id_spesa= ? ", [selectedItem.id]
        );

        if (tags.length === 0) {
            setTagModal([]);
        } else {
            setTagModal(tags.map(tag => tag.nome_tag).join(', '));
        }
    };
    useEffect(() => {
        if (selectedItem) {
            takeTag(selectedItem);
        }
    }, [selectedItem]);
    const handlePressItem = (item) => {
        setSelectedItem(item);
        toggleModal();
    };
    const renderModal = () => {
        if (!selectedItem) return null;

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    toggleModal();
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Dettagli Spesa</Text>
                        <View style={styles.modalTable}>
                            <View style={styles.modalTableRow}>
                                <Text style={styles.modalTableCellLabel}>Descrizione:</Text>
                                <Text style={styles.modalTableCellValue}>{selectedItem.descrizione}</Text>
                            </View>
                            <View style={styles.modalTableRow}>
                                <Text style={styles.modalTableCellLabel}>Categoria:</Text>
                                <Text style={styles.modalTableCellValue}>{selectedItem.categoria}</Text>
                            </View>
                            <View style={styles.modalTableRow}>
                                <Text style={styles.modalTableCellLabel}>Importo:</Text>
                                <Text style={styles.modalTableCellValue}>{selectedItem.importo}</Text>
                            </View>
                            <View style={styles.modalTableRow}>
                                <Text style={styles.modalTableCellLabel}>Data:</Text>
                                <Text style={styles.modalTableCellValue}>{new Date(selectedItem.data).toLocaleDateString('it-IT')}</Text>
                            </View>
                            <View style={styles.modalTableRow}>
                                <Text style={styles.modalTableCellLabel}>ID:</Text>
                                <Text style={styles.modalTableCellValue}>{selectedItem.id}</Text>
                            </View>
                            <View style={styles.modalTableRow}>
                                <Text style={styles.modalTableCellLabel}>Tags:</Text>
                                <Text style={styles.modalTableCellValue}>{tagModal}</Text>
                            </View>
                        </View>
                        <View style={styles.modalButtonContainer}>
                            <Pressable style={styles.modalButton} onPress={() => {
                                Alert.alert(
                                    'Elimina Spesa',
                                    'Sei sicuro di voler eliminare questa spesa?',
                                    [
                                        { text: 'Annulla', style: 'cancel' },
                                        { text: 'Elimina', onPress: () => deleteSpesa(selectedItem) },
                                    ],
                                    { cancelable: false }
                                );
                            }}>
                                <Text style={styles.modalButtonText}>Elimina</Text>
                            </Pressable>
                            <Pressable style={styles.modalButton} onPress={() => modificaSpesa(selectedItem)}>
                                <Text style={styles.modalButtonText}>Modifica</Text>
                            </Pressable>
                            <Pressable style={styles.modalButton} onPress={toggleModal}>
                                <Text style={styles.modalButtonText}>Chiudi</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

        );
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Totale Uscite di {username}</Text>

                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>Totale:</Text>
                        <Text style={styles.totalValue}>{total}{valuta}</Text>
                    </View>

                    <Text style={styles.filter}>Filtra per:</Text>

                    <View style={styles.filterContainer}>
                        <Text style={styles.label}>Categoria:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                style={styles.picker}
                                selectedValue={category}
                                onValueChange={(itemValue) => setCategory(itemValue)}
                            >
                                <Picker.Item label="Tutte" value="Tutte" />
                                {categories.map((cat, index) => (
                                    <Picker.Item key={index} label={cat.nome} value={cat.nome} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.dateContainer}>
                        <View style={styles.datePicker}>
                            <Text style={styles.label}>Data Inizio:</Text>
                            {showStartPicker && (
                                <DateTimePicker
                                    mode="date"
                                    display='spinner'
                                    value={startDate}
                                    onChange={onStartChange}
                                    maximumDate={endDate}
                                />
                            )}
                            {!showStartPicker && (
                                <Pressable onPress={toggleStartDatePicker}>
                                    <TextInput editable={false} placeholder='data' value={startDate.toDateString()} style={styles.input} />
                                </Pressable>
                            )}

                        </View>

                        <View style={styles.datePicker}>
                            <Text style={styles.label}>Data Fine:</Text>
                            {showEndPicker && (
                                <DateTimePicker
                                    mode="date"
                                    display='spinner'
                                    value={endDate}
                                    onChange={onEndChange}
                                    minimumDate={startDate}
                                    maximumDate={new Date()}
                                />
                            )}
                            {!showEndPicker && (
                                <Pressable onPress={toggleEndDatePicker}>
                                    <TextInput editable={false} placeholder='data' value={endDate.toDateString()} style={styles.input} />
                                </Pressable>
                            )}
                        </View>
                    </View>
                    <View style={styles.flatListContainer}>
                        <FlatList
                            data={spese}
                            renderItem={({ item }) => (
                                //aggiunte
                                <Pressable
                                    onPress={() => {
                                        handlePressItem(item);


                                    }}
                                >


                                    <View style={styles.spesaItem}>
                                        <Text style={styles.spesaItemText}>Descrizione: {item.descrizione}</Text>
                                        <Text style={styles.spesaItemText}>Categoria: {item.categoria}</Text>
                                        <Text style={styles.spesaItemText}>Importo: {item.importo}</Text>
                                        <Text style={styles.spesaItemText}>Data: {new Date(item.data).toLocaleDateString('it-IT')}</Text>

                                    </View>

                                </Pressable>

                            )}
                            keyExtractor={(item, index) => index.toString()}
                            scrollEnabled={false}
                            style={styles.flatList}
                            contentContainerStyle={styles.flatListContent}

                        />
                    </View>
                    {renderModal()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        minHeight: height,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FFF9C4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0057BB',
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 18,
        marginRight: 10,
        color: '#0057BB',
    },
    totalValue: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#0057BB',
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0057BB',
    },
    filter: {
        alignSelf: 'flex-start',
        fontSize: 20,
        marginBottom: 10,
        color: '#0057BB',
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginRight: 10,
        lineHeight: 40,
        fontWeight: 'bold',
        color: '#0057BB',
    },
    pickerContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#0057BB',
        height: 40,
        justifyContent: 'center',
    },
    picker: {
        flex: 1,
        textAlign: 'center',
        color: '#0057BB',
    },
    dateContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    datePicker: {
        flex: 1,
        marginRight: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#0057BB',
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0057BB',
    },
    spesaItem: {
        backgroundColor: '#EFEFEF',
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#2196F3',
    },
    spesaItemText: {
        fontSize: 16,
        color: '#0057BB',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 5,
    },
    modalField: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    modalFieldLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0057BB',
    },
    modalFieldValue: {
        flex: 2,
        fontSize: 16,
        color: '#0057BB',
    },
    modalTable: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#0057BB',
        borderRadius: 5,

    },


    modalTableRow: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#0057BB'
    },
    modalTableCellLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0057BB',


    },
    modalTableCellValue: {
        flex: 1,
        fontSize: 16,
        color: '#0057BB',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,

    },
    modalButton: {
        backgroundColor: '#0057BB',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,

    },
    modalButtonText: {
        color: '#FFF',
        fontSize: 16,

    },
    flatList: {
        flex: 0,
        width: '100%',
        backgroundColor: '#ffef99',
        borderWidth: 2,
        borderColor: '#2196F3',
        borderRadius: 30,
        padding: 20,

    },
    flatListContent: {
        paddingHorizontal: 20,

    },
    flatListContainer: {
        width: '100%',
    },

});

export default Uscita;