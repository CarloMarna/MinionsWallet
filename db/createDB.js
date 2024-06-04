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
                        path TEXT PRIMARY KEY NOT NULL
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
                    `CREATE TABLE IF NOT EXISTS categoria (
                        nome VARCHAR(50) NOT NULL,
                        idConto INTEGER NOT NULL,
                        path_icona TEXT NOT NULL,
                        PRIMARY KEY (nome, idConto),
                        FOREIGN KEY (idConto) REFERENCES conto (id),
                        FOREIGN KEY (path_icona) REFERENCES icona (path)
                    );`,
                    `CREATE TABLE IF NOT EXISTS spesa (
                        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                        importo DECIMAL(10, 2) NOT NULL,
                        data DATE NOT NULL DEFAULT (datetime('now')),
                        descrizione TEXT NOT NULL,
                        categoria VARCHAR(50) NOT NULL,
                        id_conto INTEGER NOT NULL,
                        FOREIGN KEY (categoria) REFERENCES categoria (nome),
                        FOREIGN KEY (id_conto) REFERENCES categoria (idConto)
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

                let x=await db.getFirstAsync('Select 1 as flag from valuta');
                if (x==null) {
                    await popolaDBParziale(db);
                    await popolaDBCompleto(db);
                }
                
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
    try {
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
            `INSERT INTO categoria (nome, path_icona,idConto) VALUES 
                ('Alimentazione', '/assets/img/icone_minions/Minion-Fruits.png',1),
                ('Trasporti', '/assets/img/icone_minions/Minion-Playing-Golf.png',1),
                ('Regali', '/assets/img/icone_minions/Minion-Crazy.png',1),
                ('Viaggi', '/assets/img/icone_minions/Minion-Duck.png',1),
                ('Svago', '/assets/img/icone_minions/Minion-Dancing.png',1),
                ('Altro', '/assets/img/icone_minions/Minion-Evil.png',1),
                ('Cibo', '/assets/img/icone_minions/Minion-Cake.png',1),
                ('Abbigliamento', '/assets/img/icone_minions/Minion-Shout.png',1),
                ('Intrattenimento', '/assets/img/icone_minions/Minion-Reading.png',1),
                ('Salute', '/assets/img/icone_minions/Minion-Bananas.png',1),
                ('Casa', '/assets/img/icone_minions/Minion-Shy.png',1);`,

            // Inserimento dati nella tabella 'tag'
            `INSERT INTO tag (nome) VALUES 
                ('Urgente'),
                ('Concerto'),
                ('Regalo fidanzato'),
                ('Spesa settimanale'),
                ('Croccantini Fido');`,

            // Inserimento dati nella tabella 'spesa'
            `INSERT INTO spesa (importo, data, descrizione, categoria, id_conto) VALUES
        (50.75, '2024-01-20', 'Spesa settimanale', 'Alimentazione', 1),
        (20.00, '2024-01-20', 'Biglietto del treno', 'Trasporti', 1),
        -- Categorie 'Cibo'
        (50.00, '2024-01-20', 'Spesa settimanale', 'Cibo', 1),
        (20.00, '2024-02-10', 'Cena fuori', 'Cibo', 1),
        (30.50, '2024-03-05', 'Pranzo al lavoro', 'Cibo', 1),
        (45.25, '2024-04-15', 'Spesa mensile', 'Cibo', 1),
        (22.75, '2024-05-20', 'Cena con amici', 'Cibo', 1),
        (35.80, '2024-05-30', 'Colazione al bar', 'Cibo', 1),
        (40.25, '2024-05-25', 'Spesa speciale', 'Cibo', 1),
        (55.00, '2024-05-15', 'Pizza in famiglia', 'Cibo', 1),
        (18.75, '2024-05-10', 'Cena romantica', 'Cibo', 1),
        (60.50, '2024-05-05', 'Spesa biologica', 'Cibo', 1),
        (25.40, '2024-04-25', 'Cena veloce', 'Cibo', 1),
        (38.20, '2024-04-20', 'Pranzo al ristorante', 'Cibo', 1),
    
        -- Categorie 'Abbigliamento'
        (100.00, '2024-01-25', 'Nuova giacca', 'Abbigliamento', 1),
        (80.00, '2024-02-15', 'Scarpe sportive', 'Abbigliamento', 1),
        (45.50, '2024-03-10', 'Maglietta di marca', 'Abbigliamento', 1),
        (65.25, '2024-04-20', 'Pantaloni eleganti', 'Abbigliamento', 1),
        (30.75, '2024-05-25', 'Accessori moda', 'Abbigliamento', 1),
        (55.80, '2024-05-30', 'Costume da bagno', 'Abbigliamento', 1),
        (70.25, '2024-05-25', 'Cappotto invernale', 'Abbigliamento', 1),
        (35.00, '2024-05-20', 'Maglione di lana', 'Abbigliamento', 1),
        (45.75, '2024-05-15', 'Giacca a vento', 'Abbigliamento', 1),
        (50.50, '2024-05-10', 'Vestito elegante', 'Abbigliamento', 1),
        (75.40, '2024-05-05', 'Scarpe da sera', 'Abbigliamento', 1),
        (60.20, '2024-04-25', 'Pigiama comodo', 'Abbigliamento', 1),
    
        -- Categorie 'Trasporti'
        (30.00, '2024-01-30', 'Benzina', 'Trasporti', 1),
        (15.00, '2024-02-20', 'Biglietto del bus', 'Trasporti', 1),
        (50.00, '2024-03-15', 'Taxi per l aeroporto', 'Trasporti', 1),
        (25.50, '2024-04-25', 'Carburante', 'Trasporti', 1),
        (40.75, '2024-05-30', 'Rifornimento auto', 'Trasporti', 1),
        (20.80, '2024-05-25', 'Biglietto del treno', 'Trasporti', 1),
        (35.25, '2024-05-20', 'Parcheggio', 'Trasporti', 1),
        (45.00, '2024-05-15', 'Gasolio', 'Trasporti', 1),
        (28.75, '2024-05-10', 'Biglietto aereo', 'Trasporti', 1),
        (60.50, '2024-05-05', 'Gestione veicolo', 'Trasporti', 1),
        (32.40, '2024-04-25', 'Pedaggio autostradale', 'Trasporti', 1),
    
        -- Categorie 'Intrattenimento'
        (25.00, '2024-01-10', 'Cinema', 'Intrattenimento', 1),
        (40.00, '2024-02-05', 'Abbonamento streaming', 'Intrattenimento', 1),
        (35.50, '2024-03-20', 'Libri e riviste', 'Intrattenimento', 1),
        (60.25, '2024-04-05', 'Concerto', 'Intrattenimento', 1),
        (22.75, '2024-05-15', 'Museo', 'Intrattenimento', 1),
        (30.80, '2024-05-30', 'Festa di compleanno', 'Intrattenimento', 1),
    
        -- Categorie 'Salute'
        (30.00, '2024-01-15', 'Medicinali', 'Salute', 1),
        (20.00, '2024-02-08', 'Controllo medico', 'Salute', 1),
        (50.50, '2024-03-25', 'Integratori', 'Salute', 1),
        (25.25, '2024-04-10', 'Esami del sangue', 'Salute', 1),
        (35.75, '2024-05-18', 'Visita specialistica', 'Salute', 1),
    
        -- Categorie 'Casa'
        (50.00, '2024-01-10', 'Spese condominiali', 'Casa', 1),
        (80.00, '2024-02-20', 'Ristrutturazione bagno', 'Casa', 1),
        (45.50, '2024-03-05', 'Acquisto mobili', 'Casa', 1),
        (65.25, '2024-04-15', 'Elettrodomestici', 'Casa', 1),
        (30.75, '2024-05-25', 'Manutenzione giardino', 'Casa', 1),
    
        -- Categorie 'Regali'
        (20.00, '2024-01-05', 'Regalo compleanno', 'Regali', 1),
        (30.00, '2024-02-15', 'Regalo anniversario', 'Regali', 1),
        (25.50, '2024-03-10', 'Regalo laurea', 'Regali', 1),
        (35.25, '2024-04-20', 'Regalo matrimonio', 'Regali', 1),
        (40.75, '2024-05-25', 'Regalo di Natale', 'Regali', 1),
    
        -- Categorie 'Viaggi'
        (150.00, '2024-01-20', 'Weekend in montagna', 'Viaggi', 1),
        (200.00, '2024-02-10', 'Vacanza al mare', 'Viaggi', 1),
        (350.50, '2024-03-05', 'Tour in Europa', 'Viaggi', 1),
        (180.25, '2024-04-15', 'Escursione in montagna', 'Viaggi', 1),
        (220.75, '2024-05-20', 'City break', 'Viaggi', 1),
    
        -- Categorie 'Svago'
        (25.00, '2024-01-10', 'Bowling', 'Svago', 1),
        (40.00, '2024-02-05', 'Karaoke', 'Svago', 1),
        (35.50, '2024-03-20', 'Parco divertimenti', 'Svago', 1),
        (60.25, '2024-04-05', 'Paintball', 'Svago', 1),
        (22.75, '2024-05-15', 'Escape room', 'Svago', 1),
    
        -- Categorie 'Altro'
        (35.00, '2024-01-15', 'Spese varie', 'Altro', 1),
        (50.00, '2024-02-08', 'Donazione beneficenza', 'Altro', 1),
        (65.50, '2024-03-25', 'Pagamenti online', 'Altro', 1),
        (45.25, '2024-04-10', 'Commissioni bancarie', 'Altro', 1),
        (55.75, '2024-05-18', 'Tasse', 'Altro', 1);`,

            // Inserimento dati nella tabella 'tag_spesa'
            `INSERT INTO tag_spesa (id_spesa, nome_tag) VALUES 
        (1, 'Croccantini Fido'),
        (2, 'Urgente');`
        ];
        console.log("Caricamento completo effettuato");
        for (const command of insertCommands) {
            await db.execAsync(command);
        }
    } catch (error) {
        console.error('Errore nel preparare il database Completo:', error);
    }
};

export const popolaDBParziale = async (db) => {
    try {
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
                ('carlo', 'john@example.com', '123'),
                ('john_doe', 'jane@example.com', 'password456');`,


            // Inserimento dati nella tabella 'conto'
            `INSERT INTO conto (nome_conto, sigla,username) VALUES 
                ('Conto Corrente', 'EUR', 'carlo'),
                ('Conto Risparmio', 'USD', 'john_doe');`,
        ];
        console.log("Caricamento effettuato");
        for (const command of insertCommands) {
            await db.execAsync(command);
        }
    } catch (error) {
        console.error('Errore nel preparare il database Parziale:', error);
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
