# Minions Wallet

**Minions Wallet** è un'app mobile sviluppata con **React Native** ed **Expo** per la gestione delle spese personali.

L'app permette agli utenti di registrare, organizzare e analizzare le proprie spese quotidiane attraverso un'interfaccia semplice, adattiva e intuitiva.

## Obiettivo

L'obiettivo dell'applicazione è aiutare l'utente a mantenere il controllo delle proprie finanze personali, offrendo strumenti per:

- registrare nuove spese;
- categorizzare le uscite;
- associare tag alle spese;
- visualizzare statistiche e grafici;
- modificare o eliminare spese già inserite;
- gestire un conto personale con valuta di default.

## Tecnologie utilizzate

- React Native
- Expo
- JavaScript
- TypeScript
- JSX
- SQLite
- Expo-SQLite

## Funzionalità principali

### Registrazione e login

L'utente può creare un account inserendo username, email, password, nome del conto e valuta di default.

Dopo la registrazione o il login, l'utente accede alla dashboard principale dell'applicazione.

### Dashboard

La dashboard mostra una panoramica delle spese dell'utente.

Da questa schermata è possibile:

- visualizzare il totale delle uscite;
- vedere le ultime spese inserite;
- scegliere quante spese recenti visualizzare;
- aggiungere rapidamente una nuova spesa.

### Nuova spesa

La sezione **Nuova spesa** permette di inserire una spesa completa specificando:

- importo;
- valuta;
- categoria;
- descrizione;
- data;
- uno o più tag.

È anche possibile creare nuove categorie e nuovi tag direttamente dall'app.

### Uscite

La sezione **Uscite** permette di visualizzare tutte le spese registrate.

L'utente può:

- filtrare le spese per categoria;
- filtrare le spese per intervallo di date;
- visualizzare i dettagli di una spesa;
- modificare una spesa;
- eliminare una spesa.

### Statistiche e grafici

L'app fornisce diverse statistiche sulle spese personali, tra cui:

- andamento delle spese nel tempo;
- totale delle spese per categoria;
- media delle spese per categoria;
- spesa media giornaliera, mensile o annuale;
- categoria con spesa minima e massima in un intervallo selezionato;
- distribuzione percentuale delle spese tra le categorie.

## Database

L'app utilizza SQLite per salvare i dati in modo persistente.

Il database contiene tabelle per gestire:

- utenti;
- conti;
- valute;
- categorie;
- spese;
- tag;
- icone.

È presente anche un account di test con dati pre-inseriti.

Credenziali di test:

```text
Username: prova_app
Password: 12345678
```

## Installazione

Clonare il repository:

```bash
git clone <URL_DEL_REPOSITORY>
```

Entrare nella cartella del progetto:

```bash
cd <NOME_CARTELLA_PROGETTO>
```

Installare le dipendenze:

```bash
npm install
```

## Avvio del progetto

Per avviare l'app con Expo:

```bash
npx expo start
```

Per eseguire l'app su Android:

```bash
npx expo start --android
```

In alternativa, è possibile avviare Expo e poi scegliere il dispositivo o l'emulatore dal terminale o dall'interfaccia web.

## Struttura generale del progetto

```text
project/
│
├── assets/
│   └── immagini e icone utilizzate nell'app
│
├── components/
│   └── componenti React Native dell'applicazione
│
├── database/
│   └── configurazione e gestione del database SQLite
│
├── screens/
│   └── schermate principali dell'app
│
├── App.tsx
├── package.json
└── README.md
```

## Requisiti

Prima di eseguire il progetto è necessario avere installato:

- Node.js
- npm
- Expo

Per verificare l'installazione:

```bash
node -v
npm -v
```

## Comandi principali

```bash
npm install
npx expo start
npx expo start --android
```

## Note

Il progetto è stato sviluppato a scopo accademico.

L'applicazione è pensata per dispositivi Android e supporta sia la modalità portrait sia la modalità landscape.

Alcune funzionalità, come la conversione automatica delle valute, possono richiedere una connessione Internet.

## Autori

- Carlo Marna
- Sergio Lembo
- Andrea Vitolo
- Giorgia Postiglione
