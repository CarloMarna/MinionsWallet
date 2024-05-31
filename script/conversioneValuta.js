export const conversioneValuta = async (valutPartenza, valutaArrivo, cifra) => {
    try {
        const apiKey = '3aacfff7b17f8023a5f12628';
        const risposta = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${valutPartenza}/${valutaArrivo}/${cifra}`);
        const json = await risposta.json();
        if (json.result === 'success') {
            return (jeson.conversion_result);
        } else {
            alert('Error nella converisone della valuta');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
};
