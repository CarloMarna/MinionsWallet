import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Platform, FlatList, Modal, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";

const Uscita = ({ database }) => {
    const [total, setTotal] = useState(100);
    const [category, setCategory] = useState('Tutte');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [categories, setCategories] = useState([]);
    const [spese, setSpese] = useState([]);

    //aggiunte
    const [selectedItem, setSelectedItem] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    //fine aggiunte
    //gestione picker categoria da db
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await database.getAllAsync(`SELECT nome FROM categoria`);
                setCategories(result);
            } catch (error) {
                console.error("Errore nel recupero delle categorie:", error);
            }
        };
        fetchCategories();
    }, [database]);


    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };
    //gestione calcolo totale dinamico da db
    useEffect(() => {
        const calculateTotal = async () =>{
            try{
            if(category === 'Tutte'){
            let query = "SELECT SUM(importo) AS total FROM spesa WHERE data < ? AND data > ?";
            let params = [formatDate(endDate), formatDate(startDate)];
            const result1 = await database.getAllAsync(query, params);
            setTotal(result1[0].total|| 0);
            }else{
            let query = "SELECT SUM(importo) AS total FROM spesa WHERE data < ? AND data > ? AND categoria = ?";
            let params = [formatDate(endDate), formatDate(startDate),category];
            const result2 = await database.getAllAsync(query, params);
            setTotal(result2[0].total || 0);
            }
            
        }catch(error){
            console.error("Errore il calcolo delle uscite: ", error);
        }
        };
        calculateTotal();
    },[database,category, startDate, endDate]);

    //gestione lista spese dinamica da db
    useEffect(() => {
        const fetchSpese = async () => {
            try {
                let query;
                let params;
        
                if (category === 'Tutte') {
                    query = "SELECT importo, data, categoria, descrizione,id FROM spesa WHERE data < ? AND data > ?";
                    params = [formatDate(endDate), formatDate(startDate)];
                } else {
                    query = "SELECT importo, data, categoria, descrizione,id FROM spesa WHERE data < ? AND data > ? AND categoria = ?";
                    params = [formatDate(endDate), formatDate(startDate), category];
                }
        
                const result = await database.getAllAsync(query, params);
                setSpese(result);
              
                
            } catch (error) {
                console.error("Errore nel recupero delle spese:", error);
            }
        };
        fetchSpese();
    }, [database, category, startDate, endDate]);


    /*useEffect(() => {
        console.log("Spese ordinate:", spese);
    }, [spese]);*/
    useEffect(() => {
        console.log("Spese ordinate:");
        spese.forEach(spesa => {
            console.log(`Categoria: ${spesa.categoria}, Data: ${new Date(spesa.data)}, Importo: ${spesa.importo}, Descrizione: ${spesa.descrizione}`);
        });
    }, [spese]);
    
    
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
    //aggiunte
    
    const deleteSpesa = async (spesaToDelete) => {
        try {
            console.log(spesaToDelete.id);
            await database.execAsync(
                "DELETE FROM spesa WHERE id = ?",
                [spesaToDelete.id]
            );
            console.log('Eliminazione effettuata');
            const result = await database.getAllAsync(
                "Select * from spesa where categoria= ? order by id asc", [spesaToDelete.categoria]
            );
            console.log(result);
    
            // Aggiorna lo stato delle spese, rimuovendo la spesa eliminata
            /*setSpese(prevSpese => prevSpese.filter(spesa => spesa.id !== spesaToDelete.id));
    
            // Ricalcola il totale delle spese dopo l'eliminazione
            const result = await calculateTotal();
            setTotal(result);*/
            
            // Chiudi il modal
            toggleModal();
        } catch (error) {
            console.error("Errore durante l'eliminazione della spesa:", error);
        }
    }

    const toggleModal = () => {
        setModalVisible(!modalVisible);
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
                        <Text style={styles.modalText}>Descrizione: {selectedItem.descrizione}</Text>
                        <Text style={styles.modalText}>Categoria: {selectedItem.categoria}</Text>
                        <Text style={styles.modalText}>Importo: {selectedItem.importo}</Text>
                        <Text style={styles.modalText}>Data: {new Date(selectedItem.data).toLocaleDateString('it-IT')}</Text>
                        <Text style={styles.modalText}>ID: {selectedItem.id}</Text>
                        <Button title="Elimina" onPress={() => {
                        Alert.alert(
                            'Elimina Spesa',
                            'Sei sicuro di voler eliminare questa spesa?',
                            [
                                { text: 'Annulla', style: 'cancel' },
                                { text: 'Elimina', onPress: () => deleteSpesa(selectedItem) }
                            ],
                            { cancelable: false }
                        );
                    }} />
                        <Button title="Chiudi" onPress={toggleModal} />
                    </View>
                </View>
            </Modal>
        );
    };

    //fine aggiunte
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Totale Uscite</Text>

            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Totale:</Text>
                <Text style={styles.totalValue}>{total}</Text>
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
                        />
                    )}
                    {!showEndPicker && (
                        <Pressable onPress={toggleEndDatePicker}>
                            <TextInput editable={false} placeholder='data' value={endDate.toDateString()} style={styles.input} />
                        </Pressable>
                    )}
                </View>
            </View>
            <FlatList
                data={spese}
                renderItem={({ item }) => (
                    //aggiunte
                    <Pressable
                        onPress={() => {
                            setSelectedItem(item);
                            toggleModal();
                        }}
                    >
                    {/*fine Aggiunte */}
                    
                    <View style={styles.spesaItem}>
                        <Text style={styles.spesaItemText}>Descrizione: {item.descrizione}</Text>
                        <Text style={styles.spesaItemText}>Categoria: {item.categoria}</Text>
                        <Text style={styles.spesaItemText}>Importo: {item.importo}</Text>
                        <Text style={styles.spesaItemText}>Data: {new Date(item.data).toLocaleDateString('it-IT')}</Text>
                        
                    </View>
                    {/* Aggiunte */}
                    </Pressable>
                    
                )}
                keyExtractor={(item, index) => index.toString()}

                
            />
            {renderModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FEEC47',
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
        borderRadius: 20,
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
    }
});

export default Uscita;
