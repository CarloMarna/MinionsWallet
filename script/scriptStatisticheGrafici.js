//SCRIPT PER GRAFICI
const monthNames = {
    "01": "Genn",
    "02": "Febb",
    "03": "Mar",
    "04": "Apr",
    "05": "Mag",
    "06": "Giu",
    "07": "Lug",
    "08": "Ago",
    "09": "Set",
    "10": "Ott",
    "11": "Nov",
    "12": "Dic"
};

export const caricaSpesePerAnno = async (database) => {
    try {
        const result = await database.getAllAsync(`
            SELECT strftime('%m', data) as mese, SUM(importo) as totale_spese
            FROM spesa
            WHERE strftime('%Y-%m', data) BETWEEN strftime('%Y-%m', 'now', '-1 year') AND strftime('%Y-%m', 'now')
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

export const caricaSpesePerCategoria = async (database) => {
    try {
        const result = await database.getAllAsync(`
            SELECT categoria, SUM(importo) AS totale_spesa 
            FROM spesa 
            WHERE id_conto = 1 
            GROUP BY categoria
            ORDER BY totale_spesa DESC;
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

export const ottieniValuta = async (database) => {
    try {
        const result = await database.getFirstAsync(`
        SELECT v.simbolo AS valuta_conto
        FROM conto c JOIN valuta v ON c.sigla = v.sigla
        WHERE c.id = 1
    `);
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

export const calcolaSpesaMinMax = async (database, dataInizio, dataFine) => {
    try {
        const formattedDataInizio = formatDate(dataInizio);
        const formattedDataFine = formatDate(dataFine);

        const resultMin = await database.getFirstAsync(`
                SELECT s.importo as importo, s.categoria, c.path_icona
                FROM spesa s join categoria c  on s.categoria = c.nome
                WHERE data BETWEEN ? AND ? AND s.id_conto = 1
                ORDER by importo 
                LIMIT 1;
            `, [formattedDataInizio, formattedDataFine]);

        const resultMax = await database.getFirstAsync(`
                SELECT s.importo as importo, s.categoria, c.path_icona
                FROM spesa s join categoria c  on s.categoria = c.nome
                WHERE s.data BETWEEN ? AND ? AND s.id_conto = 1
                ORDER BY importo  DESC
                LIMIT 1;
            `, [formattedDataInizio, formattedDataFine]);

        if (resultMax) {
            resultMax.path_icona = resultMax.path_icona;
        }
        if (resultMin) {
            resultMin.path_icona = resultMin.path_icona;
        }
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
// databaseMedia.js

export const calcolaMedia = async (database, opzione) => {
    try {
        let query = '';
        if (opzione === 'Giorno') {
            query = 'SELECT ROUND(AVG(importo), 3) AS media FROM spesa WHERE date(data) = date("now")';
        } else if (opzione === 'Mese') {
            query = 'SELECT ROUND(AVG(importo), 3) AS media FROM spesa WHERE strftime("%Y-%m", data) = strftime("%Y-%m", "now")';
        } else if (opzione === 'Anno') {
            query = 'SELECT ROUND(AVG(importo), 3) AS media FROM spesa WHERE strftime("%Y", data) = strftime("%Y", "now")';
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
// databaseSpesePerCategoria.js

export const caricaSpesePerCategoriaSezione = async (database) => {
    try {
        const result = await database.getAllAsync(`
            SELECT categoria, SUM(importo) AS totale_spesa 
            FROM spesa 
            WHERE id_conto = 1 
            GROUP BY categoria
            ORDER BY totale_spesa Desc
        `);

        let totaleSpesa = 0;
        result.forEach(item => totaleSpesa += item.totale_spesa);

        const spesePerCategoria = result.map(item => ({
            categoria: item.categoria,
            percentuale: ((item.totale_spesa / totaleSpesa) * 100).toFixed(2)
        }));
        return spesePerCategoria;
    } catch (error) {
        console.error("Errore durante il recupero delle spese:", error);
        return [];
    }
};




