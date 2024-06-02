//SCRIPT PER GRAFICI
const monthNames = {
    "01": "Gennaio",
    "02": "Febbraio",
    "03": "Marzo",
    "04": "Aprile",
    "05": "Maggio",
    "06": "Giugno",
    "07": "Luglio",
    "08": "Agosto",
    "09": "Settembre",
    "10": "Ottobre",
    "11": "Novembre",
    "12": "Dicembre"
};

export const caricaSpesePerAnno = async (database, idConto) => {
    try {
        const result = await database.getAllAsync(`
            SELECT strftime('%m', data) as mese, SUM(importo) as totale_spese
            FROM spesa
            WHERE strftime('%Y-%m', data) BETWEEN strftime('%Y-%m', 'now', '-1 year') AND strftime('%Y-%m', 'now')
            AND id_conto = ${idConto}
            GROUP BY mese
            ORDER BY mese;
        `);

        return result.map(item => ({
            mese: monthNames[item.mese] || item.mese,
            totale: parseFloat(item.totale_spese)
        }));
    } catch (error) {
        console.error("Errore durante il recupero delle spese per anno:", error);
        throw error;
    }
};

export const caricaSpesePerCategoria = async (database, idConto) => {
    try {
        const result = await database.getAllAsync(`
            SELECT categoria, SUM(importo) AS totale_spesa 
            FROM spesa 
            WHERE id_conto = ${idConto}
            GROUP BY categoria
            ORDER BY categoria, totale_spesa DESC;
        `);

        return result.map(item => ({
            categoria: item.categoria,
            speseCategoria: parseFloat(item.totale_spesa)
        }));
    } catch (error) {
        console.error("Errore durante il recupero delle spese per categoria:", error);
        throw error;
    }
};

export const caricaSpesePerCategoriaMedia = async (database, idConto) => {
    try {
        const result = await database.getAllAsync(`
            SELECT categoria, ROUND(AVG(importo),2) AS totale_spesa 
            FROM spesa 
            WHERE id_conto =${idConto} 
            GROUP BY categoria
            ORDER BY categoria, totale_spesa DESC;
        `);

        return result.map(item => ({
            categoria: item.categoria,
            speseCategoria: parseFloat(item.totale_spesa)
        }));
    } catch (error) {
        console.error("Errore durante il recupero delle spese per categoria:", error);
        throw error;
    }
};

export const ottieniValuta = async (database, idConto) => {
    try {
        const result = await database.getFirstAsync(`
        SELECT v.simbolo AS valuta_conto
        FROM conto c JOIN valuta v ON c.sigla = v.sigla
        WHERE c.id =  ${idConto}`);
        return result.valuta_conto.toString();
    } catch (error) {
        console.error("Errore durante il recupero della valuta:", error);
        throw error;
    }
};

// SCRIPT PER INTERVALLO

export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

export const calcolaSpesaMinMax = async (database, dataInizio, dataFine, idConto) => {
    try {
        const formattedDataInizio = formatDate(dataInizio);
        const formattedDataFine = formatDate(dataFine);
        const resultMin = await database.getFirstAsync(`
                SELECT s.importo, s.categoria, c.path_icona
                FROM spesa s join categoria c  on (s.categoria = c.nome and s.id_conto = c.idConto)
                WHERE (data BETWEEN ? AND ? )AND s.id_conto = ${idConto}
                ORDER by importo 
                LIMIT 1;
            `, [formattedDataInizio, formattedDataFine]);



        const resultMax = await database.getFirstAsync(`
                SELECT s.importo, s.categoria, c.path_icona
                FROM spesa s join categoria c  on (s.categoria = c.nome  and s.id_conto = c.idConto)
                WHERE (s.data BETWEEN ? AND ?) AND s.id_conto = ${idConto}
                ORDER BY importo  DESC
                LIMIT 1;
            `, [formattedDataInizio, formattedDataFine]);

        console.log("Categoria minima: " + resultMin.toString());
        console.log("Categoria massima: " + resultMax.toString());
        return {
            min: resultMin ? resultMin.importo : 0,
            max: resultMax ? resultMax.importo : 0,
            categoriaMin: resultMin ? resultMin.categoria : 'N/A',
            categoriaMax: resultMax ? resultMax.categoria : 'N/A',
            pathMin: resultMin ? resultMin.path_icona : '',
            pathMax: resultMax ? resultMax.path_icona : '',
        };
    } catch (error) {
        console.error("Errore durante il calcolo delle spese minime e massime:", error);
        return { min: 0, max: 0, categoriaMin: 'N/A', categoriaMax: 'N/A', pathMin: '', pathMax: '' };
    }
};

//Script per MEDIA


export const calcolaMedia = async (database, opzione, idConto) => {
    try {
        let query = '';
        if (opzione === 'Giorno') {
            query = 'SELECT ROUND(AVG(importo), 2) AS media FROM spesa WHERE date(data) = date("now") and id_conto = ' + idConto + ';';
        } else if (opzione === 'Mese') {
            query = 'SELECT ROUND(AVG(importo), 2) AS media FROM spesa WHERE strftime("%Y-%m", data) = strftime("%Y-%m", "now") and id_conto = ' + idConto + ';';
        } else if (opzione === 'Anno') {
            query = 'SELECT ROUND(AVG(importo), 2) AS media FROM spesa WHERE strftime("%Y", data) = strftime("%Y", "now") and id_conto = ' + idConto + ';';
        }

        const result = await database.getFirstAsync(query);
        if (result && result.media !== null) {
            return result.media.toString();
        }
    } catch (error) {
        console.error("Errore durante il calcolo della media:", error);
    }

    return '0.000';
};


//Script Spese Per Categoria

export const caricaSpesePerCategoriaSezione = async (database, idConto) => {
    try {
        const result = await database.getAllAsync(`
            SELECT s.categoria, c.path_icona, SUM(s.importo) AS totale_spesa 
            FROM spesa s join categoria c on s.categoria = c.nome and s.id_conto = c.idConto
            WHERE id_conto = ${idConto}
            GROUP BY categoria, path_icona
            ORDER BY totale_spesa Desc;
        `);

        let totaleSpesa = 0;
        result.forEach(item => totaleSpesa += item.totale_spesa);

        const spesePerCategoria = result.map(item => ({
            categoria: item.categoria,
            percentuale: ((item.totale_spesa / totaleSpesa) * 100).toFixed(2),
            path: item.path_icona
        }));
        return spesePerCategoria;
    } catch (error) {
        console.error("Errore durante il recupero delle spese:", error);
        return [];
    }
};




