import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const useDatabase = () => {
    const [database, setDatabase] = useState(null);

    useEffect(() => {
        const dbPromise = SQLite.openDatabaseAsync('minionswallet.db');
        const prepareDB = async () => {
            try {
                const db = await dbPromise;
               await deleteTable(db);
                const sqlCommands = [
                    `CREATE TABLE IF NOT EXISTS valuta (
                        sigla CHAR(3) PRIMARY KEY NOT NULL,
                        nome VARCHAR(50) NOT NULL,
                        simbolo VARCHAR(5) NOT NULL
                    );`,
                    `CREATE TABLE IF NOT EXISTS icona (
                        path VARCHAR(100) PRIMARY KEY NOT NULL
                    );`,
                    `CREATE TABLE IF NOT EXISTS categoria (
                        nome VARCHAR(50) PRIMARY KEY NOT NULL,
                        path_icona VARCHAR(100) NOT NULL,
                        FOREIGN KEY (path_icona) REFERENCES icona (path)
                    );`,
                    `CREATE TABLE IF NOT EXISTS utente (
                        username VARCHAR(50) PRIMARY KEY NOT NULL,
                        mail VARCHAR(100) NOT NULL UNIQUE,
                        pwd VARCHAR(255) NOT NULL
                    );`,
                    `CREATE TABLE IF NOT EXISTS conto (
                        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        nome_conto VARCHAR(50) NOT NULL,
                        data_apertura DATE NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                        sigla CHAR(3) NOT NULL,
                        username varchar(50)  NOT NULL,
                        FOREIGN KEY (username) REFERENCES utente (username) ON DELETE CASCADE ON UPDATE CASCADE
                        FOREIGN KEY (sigla) REFERENCES valuta (sigla)
                    );`,
                    `CREATE TABLE IF NOT EXISTS spesa (
                        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        importo DECIMAL(10, 2) NOT NULL,
                        data DATE NOT NULL DEFAULT (datetime('now')),
                        descrizione TEXT NOT NULL,
                        categoria VARCHAR(50) NOT NULL,
                        id_conto INTEGER NOT NULL,
                        FOREIGN KEY (categoria) REFERENCES categoria (nome),
                        FOREIGN KEY (id_conto) REFERENCES conto (id)
                    );`,
                    `CREATE TABLE IF NOT EXISTS tag (
                        nome VARCHAR(30) PRIMARY KEY NOT NULL
                    );`,
                    `CREATE TABLE IF NOT EXISTS tag_spesa (
                        id_spesa INTEGER NOT NULL,
                        nome_tag VARCHAR(30) NOT NULL,
                        PRIMARY KEY (id_spesa, nome_tag),
                        FOREIGN KEY (id_spesa) REFERENCES spesa (id) ON DELETE CASCADE ON UPDATE CASCADE,
                        FOREIGN KEY (nome_tag) REFERENCES tag (nome)
                    );`
                ];
                for (const command of sqlCommands) {
                    await db.execAsync(command);
                }
                await popolaDBParziale(db);
                await popolaDBCompleto(db);
                setDatabase(db);
            } catch (error) {
                console.error('Errore nel preparare il database:', error);
            }
        };

        prepareDB();
        return () => {
            if (database) {
                database.close();
            }
        };
    }, []);

    return database;
};


export const popolaDBCompleto = async (db) => {
    const insertCommands = [
        // Inserimento dati nella tabella 'icona'
        `INSERT INTO icona (path) VALUES 
        ('/assets/img/icone_minions/Minion-Bananas.png'),
        ('/assets/img/icone_minions/Minion-Cake.png'),
        ('/assets/img/icone_minions/Minion-Crazy.png'),
        ('/assets/img/icone_minions/Minion-Dancing.png'),
        ('/assets/img/icone_minions/Minion-Duck.png'),
        ('/assets/img/icone_minions/Minion-Evil.png'),
        ('/assets/img/icone_minions/Minion-Fruits.png'),
        ('/assets/img/icone_minions/Minion-Kungfu.png'),
        ('/assets/img/icone_minions/Minion-Maid.png'),
        ('/assets/img/icone_minions/Minion-Playing-Golf.png'),
        ('/assets/img/icone_minions/Minion-Reading.png'),
        ('/assets/img/icone_minions/Minion-Sad.png'),
        ('/assets/img/icone_minions/Minion-Shout.png'),
        ('/assets/img/icone_minions/Minion-Shy.png'),
        ('/assets/img/icone_minions/Minions-Chitarra.png'),
        ('/assets/img/icone_minions/Minions-Festa.png'),
        ('/assets/img/icone_minions/Minions-Spa.png'),
        ('/assets/img/icone_minions/Minions-Pillola.png'),
        ('/assets/img/icone_minions/Minions-Christmas.png'),
        ('/assets/img/icone_minions/Minions-Chef.png'),
        ('/assets/img/icone_minions/Minions-Vacay.png'),
        ('/assets/img/icone_minions/Minions-Toy.png'),
        ('/assets/img/icone_minions/Minions-Woman.png'),
        ('/assets/img/icone_minions/Minions-Transport.png'),
        ('/assets/img/icone_minions/Minions-Technology.png'),
        ('/assets/img/icone_minions/Minions-NewYork.png'),
        ('/assets/img/icone_minions/Minions-Jewels.png'),
        ('/assets/img/icone_minions/Minions-Sad-Christmas.png');
        `,

        // Inserimento dati nella tabella 'categoria'
        `INSERT INTO categoria (nome, path_icona) VALUES 
                ('Alimentazione', '/assets/img/icone_minions/Minion-Fruits.png'),
                ('Trasporti', '/assets/img/icone_minions/Minion-Playing-Golf.png'),
                ('Regali', '/assets/img/icone_minions/Minion-Crazy.png'),
                ('Viaggi', '/assets/img/icone_minions/Minion-Duck.png'),
                ('Svago', '/assets/img/icone_minions/Minion-Dancing.png'),
                ('Altro', '/assets/img/icone_minions/Minion-Evil.png'),
                ('Cibo', '/assets/img/icone_minions/Minion-Cake.png'),
                ('Abbigliamento', '/assets/img/icone_minions/Minion-Shout.png'),
                ('Intrattenimento', '/assets/img/icone_minions/Minion-Reading.png'),
                ('Salute', '/assets/img/icone_minions/Minion-Bananas.png'),
                ('Casa', '/assets/img/icone_minions/Minion-Shy.png');`,

        // Inserimento dati nella tabella 'tag'
        `INSERT INTO tag (nome) VALUES 
                ('Urgente'),
                ('Concerto'),
                ('Regalo fidanzato/a'),
                ('Spesa settimanale'),
                ('Croccantini Fido');`,

        // Inserimento dati nella tabella 'conto'
        `INSERT INTO conto (nome_conto, sigla,username) VALUES 
                ('Conto Corrente', 'EUR', 'jane_doe'),
                ('Conto Risparmio', 'USD', 'john_doe');`,

        // Inserimento dati nella tabella 'spesa'
        `INSERT INTO spesa (importo, descrizione, categoria, id_conto) VALUES 
        (50.75, 'Spesa settimanale', 'Alimentazione', 1),
        (20.00, 'Biglietto del treno', 'Trasporti', 1);`,

        `INSERT INTO spesa (importo, descrizione, categoria, id_conto) VALUES 
        (50.75, 'Spesa settimanale', 'Alimentazione', 1),
        (20.00, 'Biglietto del treno', 'Droga', 1);`,

        `INSERT INTO spesa (importo, data, descrizione, categoria, id_conto) VALUES
            -- Categorie 'Cibo'
            (50.00, '2024-01-20', 'Spesa settimanale', 'Cibo', 1),
            (20.00, '2024-02-10', 'Cena fuori', 'Cibo', 1),
            (30.50, '2024-03-05', 'Pranzo al lavoro', 'Cibo', 1),
            (45.25, '2024-04-15', 'Spesa mensile', 'Cibo', 1),
            (22.75, '2024-05-20', 'Cena con amici', 'Cibo', 1),
            (35.80, '2024-06-10', 'Colazione al bar', 'Cibo', 1),
            (40.25, '2024-07-05', 'Spesa speciale', 'Cibo', 1),
            (55.00, '2024-08-15', 'Pizza in famiglia', 'Cibo', 1),
            (18.75, '2024-09-20', 'Cena romantica', 'Cibo', 1),
            (60.50, '2024-10-10', 'Spesa biologica', 'Cibo', 1),
            (25.40, '2024-11-05', 'Cena veloce', 'Cibo', 1),
            (38.20, '2024-12-10', 'Pranzo al ristorante', 'Cibo', 1),
    
            -- Categorie 'Abbigliamento'
            (100.00, '2024-01-25', 'Nuova giacca', 'Abbigliamento', 1),
            (80.00, '2024-02-15', 'Scarpe sportive', 'Abbigliamento', 1),
            (45.50, '2024-03-10', 'Maglietta di marca', 'Abbigliamento', 1),
            (65.25, '2024-04-20', 'Pantaloni eleganti', 'Abbigliamento', 1),
            (30.75, '2024-05-25', 'Accessori moda', 'Abbigliamento', 1),
            (55.80, '2024-06-15', 'Costume da bagno', 'Abbigliamento', 1),
            (70.25, '2024-07-10', 'Cappotto invernale', 'Abbigliamento', 1),
            (35.00, '2024-08-20', 'Maglione di lana', 'Abbigliamento', 1),
            (45.75, '2024-09-25', 'Giacca a vento', 'Abbigliamento', 1),
            (50.50, '2024-10-15', 'Vestito elegante', 'Abbigliamento', 1),
            (75.40, '2024-11-10', 'Scarpe da sera', 'Abbigliamento', 1),
            (60.20, '2024-12-20', 'Pigiama comodo', 'Abbigliamento', 1),
    
            -- Categorie 'Trasporti'
            (30.00, '2024-01-30', 'Benzina', 'Trasporti', 1),
            (15.00, '2024-02-20', 'Biglietto del bus', 'Trasporti', 1),
            (50.00, '2024-03-15', 'Taxi per l aeroporto', 'Trasporti', 1),
            (25.50, '2024-04-25', 'Carburante', 'Trasporti', 1),
            (40.75, '2024-05-30', 'Rifornimento auto', 'Trasporti', 1),
            (20.80, '2024-06-20', 'Biglietto del treno', 'Trasporti', 1),
            (35.25, '2024-07-15', 'Parcheggio', 'Trasporti', 1),
            (45.00, '2024-08-25', 'Gasolio', 'Trasporti', 1),
            (28.75, '2024-09-30', 'Biglietto aereo', 'Trasporti', 1),
            (60.50, '2024-10-20', 'Gestione veicolo', 'Trasporti', 1),
            (32.40, '2024-11-15', 'Pedaggio autostradale', 'Trasporti', 1),
            (48.20, '2024-12-30', 'Bicicletta nuova', 'Trasporti', 1),
    
            -- Categorie 'Intrattenimento'
            (25.00, '2024-01-10', 'Cinema', 'Intrattenimento', 1),
            (40.00, '2024-02-05', 'Abbonamento streaming', 'Intrattenimento', 1),
            (35.50, '2024-03-20', 'Libri e riviste', 'Intrattenimento', 1),
            (60.25, '2024-04-05', 'Concerto', 'Intrattenimento', 1),
            (22.75, '2024-05-15', 'Museo', 'Intrattenimento', 1),
            (30.80, '2024-06-05', 'Festa di compleanno', 'Intrattenimento', 1),
            (50.25, '2024-07-20', 'Eventi culturali', 'Intrattenimento', 1),
            (55.00, '2024-08-05', 'Teatro', 'Intrattenimento', 1),
            (18.75, '2024-09-15', 'Parco divertimenti', 'Intrattenimento', 1),
            (40.50, '2024-10-05', 'Corsi di ballo', 'Intrattenimento', 1),
            (28.40, '2024-11-20', 'Visita zoo', 'Intrattenimento', 1),
            (45.20, '2024-12-05', 'Parchi tematici', 'Intrattenimento', 1),
    
            -- Categorie 'Salute'
            (30.00, '2024-01-15', 'Medicinali', 'Salute', 1),
            (20.00, '2024-02-08', 'Controllo medico', 'Salute', 1),
            (50.50, '2024-03-25', 'Integratori', 'Salute', 1),
            (25.25, '2024-04-10', 'Esami del sangue', 'Salute', 1),
            (35.75, '2024-05-18', 'Visita specialistica', 'Salute', 1),
            (15.80, '2024-06-22', 'Farmaci', 'Salute', 1),
            (28.25, '2024-07-17', 'Controllo dentista', 'Salute', 1),
            (20.00, '2024-08-28', 'Prodotti per la salute', 'Salute', 1),
            (40.75, '2024-09-05', 'Esami diagnostici', 'Salute', 1),
            (55.50, '2024-10-30', 'Cura olistica', 'Salute', 1),
            (18.75, '2024-11-25', 'Vitamine', 'Salute', 1),
            (30.20, '2024-12-15', 'Accessori fitness', 'Salute', 1),
    
            -- Categorie 'Casa'
            (50.00, '2024-01-10', 'Spese condominiali', 'Casa', 1),
            (80.00, '2024-02-20', 'Ristrutturazione bagno', 'Casa', 1),
            (45.50, '2024-03-05', 'Acquisto mobili', 'Casa', 1),
            (65.25, '2024-04-15', 'Elettrodomestici', 'Casa', 1),
            (30.75, '2024-05-25', 'Manutenzione giardino', 'Casa', 1),
            (55.80, '2024-06-10', 'Decorazioni interne', 'Casa', 1),
            (70.25, '2024-07-20', 'Cambio serrature', 'Casa', 1),
            (35.00, '2024-08-05', 'Spese energia elettrica', 'Casa', 1),
            (45.75, '2024-09-15', 'Riparazione elettrica', 'Casa', 1),
            (50.50, '2024-10-25', 'Spese idriche', 'Casa', 1),
            (75.40, '2024-11-10', 'Riparazione tetto', 'Casa', 1),
            (60.20, '2024-12-20', 'Manutenzione riscaldamento', 'Casa', 1),
    
            -- Categorie 'Regali'
            (20.00, '2024-01-05', 'Regalo compleanno', 'Regali', 1),
            (30.00, '2024-02-15', 'Regalo anniversario', 'Regali', 1),
            (25.50, '2024-03-10', 'Regalo laurea', 'Regali', 1),
            (35.25, '2024-04-20', 'Regalo matrimonio', 'Regali', 1),
            (40.75, '2024-05-25', 'Regalo di Natale', 'Regali', 1),
            (45.80, '2024-06-15', 'Regalo battesimo', 'Regali', 1),
            (50.25, '2024-07-10', 'Regalo comunione', 'Regali', 1),
            (55.00, '2024-08-25', 'Regalo cresima', 'Regali', 1),
            (60.75, '2024-09-30', 'Regalo di compleanno', 'Regali', 1),
            (65.50, '2024-10-20', 'Regalo anniversario matrimonio', 'Regali', 1),
            (70.40, '2024-11-15', 'Regalo battesimo', 'Regali', 1),
            (75.20, '2024-12-25', 'Regalo di Natale', 'Regali', 1),
    
            -- Categorie 'Viaggi'
            (150.00, '2024-01-20', 'Weekend in montagna', 'Viaggi', 1),
            (200.00, '2024-02-10', 'Vacanza al mare', 'Viaggi', 1),
            (350.50, '2024-03-05', 'Tour in Europa', 'Viaggi', 1),
            (180.25, '2024-04-15', 'Escursione in montagna', 'Viaggi', 1),
            (220.75, '2024-05-20', 'City break', 'Viaggi', 1),
            (280.80, '2024-06-10', 'Tour enogastronomico', 'Viaggi', 1),
            (320.25, '2024-07-05', 'Viaggio avventura', 'Viaggi', 1),
            (450.00, '2024-08-15', 'Crociera', 'Viaggi', 1),
            (350.75, '2024-09-20', 'Vacanza in Asia', 'Viaggi', 1),
            (420.50, '2024-10-10', 'Escursione natura', 'Viaggi', 1),
            (280.40, '2024-11-05', 'Weekend romantico', 'Viaggi', 1),
            (380.20, '2024-12-10', 'Tour culturale', 'Viaggi', 1),
    
            -- Categorie 'Svago'
            (25.00, '2024-01-10', 'Bowling', 'Svago', 1),
            (40.00, '2024-02-05', 'Karaoke', 'Svago', 1),
            (35.50, '2024-03-20', 'Parco divertimenti', 'Svago', 1),
            (60.25, '2024-04-05', 'Paintball', 'Svago', 1),
            (22.75, '2024-05-15', 'Escape room', 'Svago', 1),
            (30.80, '2024-06-05', 'Piscina', 'Svago', 1),
            (50.25, '2024-07-20', 'Giochi d acqua', 'Svago', 1),
            (55.00, '2024-08-05', 'Fiere e mercatini', 'Svago', 1),
            (18.75, '2024-09-15', 'Ricerca tesori', 'Svago', 1),
            (40.50, '2024-10-05', 'Corsi di ballo', 'Svago', 1),
            (28.40, '2024-11-20', 'Visita zoo', 'Svago', 1),
            (45.20, '2024-12-05', 'Parchi tematici', 'Svago', 1),
    
            -- Categorie 'Altro'
            (35.00, '2024-01-15', 'Spese varie', 'Altro', 1),
            (50.00, '2024-02-08', 'Donazione beneficenza', 'Altro', 1),
            (65.50, '2024-03-25', 'Pagamenti online', 'Altro', 1),
            (45.25, '2024-04-10', 'Commissioni bancarie', 'Altro', 1),
            (55.75, '2024-05-18', 'Tasse', 'Altro', 1),
            (20.80, '2024-06-22', 'Quota associativa', 'Altro', 1),
            (28.25, '2024-07-17', 'Spese legali', 'Altro', 1),
            (30.00, '2024-08-28', 'Registrazione domini', 'Altro', 1),
            (40.75, '2024-09-05', 'Assicurazione', 'Altro', 1),
            (25.50, '2024-10-30', 'Spese bancarie', 'Altro', 1),
            (38.75, '2024-11-25', 'Donazione beneficenza', 'Altro', 1),
            (30.20, '2024-12-15', 'Spese varie', 'Altro', 1);`,

        // Inserimento dati nella tabella 'tag_spesa'
        `INSERT INTO tag_spesa (id_spesa, nome_tag) VALUES 
        (1, 'Croccantini Fido'),
        (2, 'Urgente');`
    ];
    console.log("Caricamento completo effettuato");
    for (const command of insertCommands) {
        await db.execAsync(command);
    }
};

export const popolaDBParziale = async (db) => {
    const insertCommands = [
        // Inserimento dati nella tabella 'valuta'
        `INSERT INTO valuta (sigla, nome, simbolo) VALUES 
        ('EUR', 'Euro', '€'),
        ('USD', 'Dollar', '$'),
        ('JPY', 'Yen', '¥'),
        ('GBP', 'Sterlina', '£'),
        ('AUD', 'Dollaro australiano', '$'),
        ('CAD', 'Dollaro canadese', '$'),
        ('CHF', 'Franco svizzero', 'CHF'),
        ('CNY', 'Yuan cinese', '¥'),
        ('SEK', 'Corona svedese', 'kr'),
        ('NZD', 'Dollaro neozelandese', '$'),
        ('INR', 'Rupia indiana', '₹'),
        ('RUB', 'Rublo russo', '₽'),
        ('KRW', 'Won sudcoreano', '₩'),
        ('MXN', 'Peso messicano', '$'),
        ('BRL', 'Real brasiliano', 'R$'),
        ('ZAR', 'Rand sudafricano', 'R'),
        ('THB', 'Baht thailandese', '฿'),
        ('SAR', 'Riyal saudita', '﷼'),
        ('TRY', 'Lira turca', '₺'),
        ('AED', 'Dirham degli Emirati Arabi Uniti', 'د.إ');`,

        // Inserimento dati nella tabella 'utente'
        `INSERT INTO utente (username, mail, pwd) VALUES 
                ('john_doe', 'john@example.com', 'password123'),
                ('jane_doe', 'jane@example.com', 'password456');`,


        // Inserimento dati nella tabella 'conto'
        `INSERT INTO conto (nome_conto, sigla,username) VALUES 
                ('Conto Corrente', 'EUR', 'jane_doe'),
                ('Conto Risparmio', 'USD', 'john_doe');`,
    ];
    console.log("Caricamento effettuato");
    for (const command of insertCommands) {
        await db.execAsync(command);
    }
};


export const deleteTable = async (db) => {
    try {
        const sqlCommands = [
            'DROP TABLE IF EXISTS tag_spesa;',
            'DROP TABLE IF EXISTS spesa;',
            'DROP TABLE IF EXISTS categoria;',
            'DROP TABLE IF EXISTS tag;',
            'DROP TABLE IF EXISTS conto;',
            'DROP TABLE IF EXISTS utente;',
            'DROP TABLE IF EXISTS valuta;',
            'DROP TABLE IF EXISTS icona;'
        ];

        for (const command of sqlCommands) {
            await db.execAsync(command);
        }

        console.log('Database cancellato con successo.');
    } catch (error) {
        console.error('Errore nella cancellazione del database:', error);
    }
};


export default useDatabase;
