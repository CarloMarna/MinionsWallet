import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');


const Grafici = () => {
    const dataGraficoABarre = {
        labels: ["January", "February", "March", "April", "May", "June", "January", "February", "March", "April", "May", "June", "January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43, 20, 45, 28, 43, 20, 45, 28, 80, 99, 43]
            }
        ]
    };

    const dataGraficoAndamento = {
        labels: ["January", "February", "March", "April", "May", "June", "January", "February", "March", "April", "May", "June", "January", "February", "March", "April", "May", "June"],
        datasets: [
            {
                data: [20, 45, 28, 80, 99, 43, 20, 45, 28, 43, 20, 45, 28, 80, 99, 43]
            }
        ]
    };

    const chartConfigBarre = {
        backgroundGradientFrom: "#FDE74C", // Giallo
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#5CA4A9", // Blu
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(23, 78, 139, ${opacity})`, // Blu scuro
        strokeWidth: 2,
        barPercentage: 0.6,
        useShadowColorFromDataset: false,
    };

    const chartConfigAndamento = {
        backgroundGradientFrom: "#FFF3B0", // Giallo chiaro
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "#4CAF50", // Verde
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(23, 78, 139, ${opacity})`, // Blu scuro
        strokeWidth: 3,
        useShadowColorFromDataset: false,
    };

    return (
        <View style={{ flex: 1, }}>
            <View style={styles.containerGrafici}>
                <Text style={[styles.textStyle, { color: '#0057B8' }]}>Andamenento spese in un anno:</Text>

                <ScrollView horizontal>
                    <LineChart
                        data={dataGraficoAndamento}
                        width={Dimensions.get("window").width} // from react-native
                        height={screenHeight * 0.40}
                        yAxisLabel="$"
                        yAxisSuffix="k"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={chartConfigAndamento}
                        bezier
                        verticalLabelRotation={60}
                        style={{
                            marginVertical: 4,
                        }}
                    />
                </ScrollView>
            </View>
            <View style={styles.containerGrafici}>
                <Text style={[styles.textStyle, { color: '#0057B8' }]}>Spese su categorie:</Text>
                <ScrollView horizontal>
                    <BarChart
                        style={{
                            marginVertical: 4,
                        }}
                        data={dataGraficoABarre}
                        width={dataGraficoABarre.datasets.length * 2 * screenWidth}
                        height={screenHeight * 0.38}
                        yAxisLabel={valuta = '$'}
                        chartConfig={chartConfigBarre}
                        verticalLabelRotation={40}
                        showValuesOnTopOfBars
                        fromZero
                    />
                </ScrollView>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    containerGrafici: {
        flex: 1,
        paddingHorizontal: screenWidth * 0.05,
        paddingVertical: screenHeight * 0.01,
        borderRadius: 16,
        backgroundColor: '#FDE74C',
    },
    textStyle: {
        color: '#0057B8',
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'fredoka-one',
        fontSize: 20,
    },
});


export default Grafici;
