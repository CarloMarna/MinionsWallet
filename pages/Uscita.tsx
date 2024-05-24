import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Registration from './Registration';


const Uscita = () => {
    
    const [total, setTotal] = useState(100);
    const [category, setCategory] = useState('Tutte');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    
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
                        onValueChange={(itemValue) => setCategory(itemValue)}>
                        <Picker.Item label="Tutte" value="Tutte" />
                        <Picker.Item label="Categoria 1" value="Categoria 1" />
                        <Picker.Item label="Categoria 2" value="Categoria 2" />
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
        </View>
        
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FEEC47', // Giallo pastello
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#0057BB', // Blu scuro
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 18,
        marginRight: 10,
        color: '#0057BB', // Blu scuro
    },
    totalValue: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#0057BB', // Blu scuro
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0057BB', // Blu scuro
    },
    filter: {
        alignSelf: 'flex-start',
        fontSize: 20,
        marginBottom: 10,
        color: '#0057BB', // Blu scuro
        fontWeight: 'bold'
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
        fontWeight: 'bold', // Grassetto aggiunto
        color: '#0057BB', // Blu scuro
    },
    pickerContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#0057BB', // Blu scuro
        height: 40,
        justifyContent: 'center',
    },
    picker: {
        flex: 1,
        textAlign: 'center',
        color: '#0057BB', // Blu scuro
    },
    dateContainer: {
        flexDirection: 'row',
    },
    datePicker: {
        flex: 1,
        marginRight: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#0057BB', // Blu scuro
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0057BB', // Blu scuro
    },
});

export default Uscita;
