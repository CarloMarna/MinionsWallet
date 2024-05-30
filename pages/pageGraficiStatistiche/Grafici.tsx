import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useState, useEffect } from 'react';
import { caricaSpesePerAnno, caricaSpesePerCategoria, ottieniValuta } from '../../script/scriptStatisticheGrafici';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Grafici = ({ database }: { database: any }) => {
    const [spesePerAnno, setSpesePerAnno] = useState([]);
    const [spesePerCategoria, setSpesePerCategoria] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [valutaConto, setValuta] = useState('');

    useEffect(() => {
        const caricaDati = async () => {
            try {
                const speseAnno = await caricaSpesePerAnno(database);
                setSpesePerAnno(speseAnno);
                const speseCategoria = await caricaSpesePerCategoria(database);
                setSpesePerCategoria(speseCategoria);
                const valuta = await ottieniValuta(database);
                setValuta(valuta);
                setIsLoading(true);
            } catch (error) {
                Alert.alert("Errore", "Si è verificato un errore durante il caricamento dei dati.");
            }
        };

        caricaDati();
    }, [database]);

    const dataGraficoAndamento = {
        labels: spesePerAnno.map(item => item.mese),
        datasets: [
            {
                data: spesePerAnno.map(item => item.totale)
            }
        ]
    };

    const dataGraficoABarre = {
        labels: spesePerCategoria.map(item => item.categoria),
        datasets: [
            {
                data: spesePerCategoria.map(item => parseFloat(item.speseCategoria))
            }
        ]
    };

    const chartConfigBarre = {
        backgroundGradientFrom: "#FDE74C",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#5CA4A9",
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(23, 78, 139, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.6,
        useShadowColorFromDataset: false,
    };

    const chartConfigAndamento = {
        backgroundGradientFrom: "#FFF3B0",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#4CAF50",
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(23, 78, 139, ${opacity})`,
        strokeWidth: 3,
        useShadowColorFromDataset: false,
    };

    const renderChartOMessaggio = (data, message, ChartComponent, chartConfig) => {
        if (data.labels.length === 0) {
            return (
                <View style={styles.contanierNoSpese}>
                    <Text style={styles.contanierNoSpeseText}>{message}</Text>
                </View>
            );
        } else {
            return (
                <ScrollView horizontal>
                    <ChartComponent
                        data={data}
                        width={screenWidth * 2}
                        height={screenHeight * 0.362}
                        chartConfig={chartConfig}
                        bezier
                        verticalLabelRotation={60}
                        showValuesOnTopOfBars
                        yAxisSuffix={valutaConto}
                        style={{
                            marginVertical: 4,
                        }}
                    />
                </ScrollView>
            );
        }
    };

    if (!isLoading) {
        return (
            <View style={styles.containerCaricamento}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.textContainerCaricamento}>Caricamento...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.containerGrafici}>
                    <Text style={[styles.textStyle, { color: '#0057B8' }]}>Andamento spese in un anno:</Text>
                    {renderChartOMessaggio(dataGraficoAndamento, "Nessun dato disponibile per l'andamento delle spese.", LineChart, chartConfigAndamento)}
                </View>
                <View style={styles.containerGrafici}>
                    <Text style={[styles.textStyle, { color: '#0057B8' }]}>Spese su categorie:</Text>
                    {renderChartOMessaggio(dataGraficoABarre, "Nessun dato disponibile per le spese per categoria.", BarChart, chartConfigBarre)}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FDE74C',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    containerGrafici: {
        flex: 1,
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenHeight * 0.01,
        backgroundColor: '#FDE74C',
    },
    textStyle: {
        color: '#0057B8',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'fredoka-one',
        fontSize: 20,
    },
    containerCaricamento: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5E642',
    },
    textContainerCaricamento: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        color: '#3B3B3B',
    },
    contanierNoSpese: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contanierNoSpeseText: {
        fontSize: 18,
        color: '#FF0000',
        textAlign: 'center',
        marginVertical: 20,
    },
});

export default Grafici;
