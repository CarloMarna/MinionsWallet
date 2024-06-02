import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, Alert, ActivityIndicator, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useState, useEffect } from 'react';
import PureChart from 'react-native-pure-chart';
import { caricaSpesePerAnno, caricaSpesePerCategoria, caricaSpesePerCategoriaMedia, ottieniValuta } from '../../script/scriptStatisticheGrafici';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');


const Grafici = ({ database, idConto }) => {
    const [spesePerAnno, setSpesePerAnno] = useState([]);
    const [spesePerCategoria, setSpesePerCategoria] = useState([]);
    const [spesePerCategoriaMedia, setSpesePerCategoriaMedia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [valutaConto, setValuta] = useState('');
    const { width: windowWidth } = useWindowDimensions();
    useEffect(() => {
        const caricaDati = async () => {
            try {
                const speseAnno = await caricaSpesePerAnno(database, idConto);
                const speseCategoria = await caricaSpesePerCategoria(database, idConto);
                const speseCategoriaMedia = await caricaSpesePerCategoriaMedia(database, idConto);
                const valuta = await ottieniValuta(database, idConto);
                setSpesePerAnno(speseAnno);
                setSpesePerCategoria(speseCategoria);
                setSpesePerCategoriaMedia(speseCategoriaMedia);
                setValuta(valuta);
            } catch (error) {
                Alert.alert("Errore", "Si è verificato un errore durante il caricamento dei dati.");
            } finally {
                setIsLoading(false);
            }
        };

        caricaDati();
    }, [database]);

    const chartConfigAndamento = {
        backgroundGradientFrom: "#05AF00",
        backgroundGradientTo: "#0055FF",
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 3,
        propsForLabels: {
            fontSize: screenWidth * 0.032,
        },
    };

    const dataGraficoMedia = [
        {
            seriesName: 'Spese Categoria',
            data: spesePerCategoria.map(item => ({ x: item.categoria, y: item.speseCategoria })),
            color: '#297AB1'
        },
        {
            seriesName: 'Spese Categoria Media',
            data: spesePerCategoriaMedia.map(item => ({ x: item.categoria, y: item.speseCategoria })),
            color: 'yellow'
        }
    ];

    const dataGraficoAndamento = {
        labels: spesePerAnno.map(item => item.mese),
        datasets: [{ data: spesePerAnno.map(item => item.totale) }]
    };

    const legenda = dataGraficoMedia.map((data, index) => (
        <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: data.color }]} />
            <Text style={styles.legendText}>{data.seriesName} in {valutaConto}</Text>
        </View>
    ));

    const handleDataPointClick = (data) => {
        const dataIndex = data.index;
        const mese = dataGraficoAndamento.labels[dataIndex];
        const valore = data.value;
        Alert.alert('Dettagli', `Mese: ${mese}\nImporto Totale: ${valore}${valutaConto}`, [{ text: 'OK' }]);
    };

    if (isLoading) {
        return (
            <View style={styles.containerCaricamento}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.textCaricamento}>Caricamento...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.containerGrafici}>
                    <Text style={styles.textTitle}>Andamento Spese Annuo:</Text>
                    {dataGraficoAndamento.labels.length === 0 ? (
                        <View style={styles.containerNoSpese}>
                            <Text style={styles.textNoSpese}>Nessun dato disponibile per l'andamento delle spese.</Text>
                        </View>
                    ) : (
                        <ScrollView horizontal>
                            <LineChart
                                data={dataGraficoAndamento}
                                width={windowWidth}
                                height={screenHeight * 0.362}
                                chartConfig={chartConfigAndamento}
                                bezier
                                yAxisSuffix={valutaConto}
                                style={styles.chart}
                                onDataPointClick={handleDataPointClick}
                            />
                        </ScrollView>
                    )}
                </View>
                <View style={styles.containerGrafici}>
                    <Text style={styles.textTitle}>Confronto Spese Categoria e Media:</Text>
                    {spesePerCategoria.length === 0 ? (
                        <View style={styles.containerNoSpese}>
                            <Text style={styles.textNoSpese}>Nessun dato disponibile per le spese per categoria.</Text>
                        </View>
                    ) : (
                        <>
                            <PureChart data={dataGraficoMedia} type='bar' height={screenHeight * 0.25} />
                            <View style={styles.legend}>{legenda}</View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF9C4',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    containerGrafici: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FFF5EE',
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    textTitle: {
        color: '#2F4F4F',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 22,
        marginBottom: 15,
    },
    containerCaricamento: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAEBD7',
    },
    textCaricamento: {
        fontSize: 18, fontWeight: 'bold',
        marginTop: 20,
        color: '#4682B4',
    },
    containerNoSpese: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textNoSpese: {
        fontSize: 18,
        color: '#B22222',
        textAlign: 'center',
        marginVertical: 20,
    },

    chart: {
        marginVertical: 8,
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    legend: {
        flexDirection: 'row',
        marginTop: 8,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
        flex: 1,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 4,
    },
    legendText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default Grafici;


