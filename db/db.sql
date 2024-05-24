-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Mag 21, 2024 alle 13:50
-- Versione del server: 10.4.28-MariaDB
-- Versione PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `minionswallet`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `categoria`
--

CREATE TABLE `categoria` (
  `nome` varchar(50) NOT NULL,
  `path_icona` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `conto`
--

CREATE TABLE `conto` (
  `id` int(11) NOT NULL,
  `nome_conto` varchar(50) NOT NULL,
  `data_apertura` date NOT NULL DEFAULT current_timestamp(),
  `sigla` char(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `icona`
--

CREATE TABLE `icona` (
  `path` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `spesa`
--

CREATE TABLE `spesa` (
  `id` int(11) NOT NULL,
  `importo` decimal(10,2) NOT NULL,
  `data` date NOT NULL DEFAULT current_timestamp(),
  `descrizione` text NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `id_conto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `tag`
--

CREATE TABLE `tag` (
  `nome` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `tag_spesa`
--

CREATE TABLE `tag_spesa` (
  `id_spesa` int(11) NOT NULL,
  `nome_tag` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

CREATE TABLE `utente` (
  `username` varchar(50) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  `id_conto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `valuta`
--

CREATE TABLE `valuta` (
  `sigla` char(3) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `simbolo` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`nome`),
  ADD KEY `path_icona` (`path_icona`);

--
-- Indici per le tabelle `conto`
--
ALTER TABLE `conto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sigla` (`sigla`);

--
-- Indici per le tabelle `icona`
--
ALTER TABLE `icona`
  ADD PRIMARY KEY (`path`),
  ADD KEY `path` (`path`);

--
-- Indici per le tabelle `spesa`
--
ALTER TABLE `spesa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria` (`categoria`),
  ADD KEY `id_conto` (`id_conto`);

--
-- Indici per le tabelle `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`nome`);

--
-- Indici per le tabelle `tag_spesa`
--
ALTER TABLE `tag_spesa`
  ADD PRIMARY KEY (`id_spesa`,`nome_tag`),
  ADD KEY `id_spesa` (`id_spesa`,`nome_tag`),
  ADD KEY `nome_tag` (`nome_tag`);

--
-- Indici per le tabelle `utente`
--
ALTER TABLE `utente`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `mail` (`mail`),
  ADD KEY `id_conto` (`id_conto`);

--
-- Indici per le tabelle `valuta`
--
ALTER TABLE `valuta`
  ADD PRIMARY KEY (`sigla`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `conto`
--
ALTER TABLE `conto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `spesa`
--
ALTER TABLE `spesa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `categoria`
--
ALTER TABLE `categoria`
  ADD CONSTRAINT `categoria_ibfk_1` FOREIGN KEY (`path_icona`) REFERENCES `icona` (`path`);

--
-- Limiti per la tabella `conto`
--
ALTER TABLE `conto`
  ADD CONSTRAINT `conto_ibfk_1` FOREIGN KEY (`sigla`) REFERENCES `valuta` (`sigla`);

--
-- Limiti per la tabella `spesa`
--
ALTER TABLE `spesa`
  ADD CONSTRAINT `spesa_ibfk_1` FOREIGN KEY (`categoria`) REFERENCES `categoria` (`nome`),
  ADD CONSTRAINT `spesa_ibfk_2` FOREIGN KEY (`id_conto`) REFERENCES `conto` (`id`);

--
-- Limiti per la tabella `tag_spesa`
--
ALTER TABLE `tag_spesa`
  ADD CONSTRAINT `tag_spesa_ibfk_1` FOREIGN KEY (`id_spesa`) REFERENCES `spesa` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tag_spesa_ibfk_2` FOREIGN KEY (`nome_tag`) REFERENCES `tag` (`nome`);

--
-- Limiti per la tabella `utente`
--
ALTER TABLE `utente`
  ADD CONSTRAINT `utente_ibfk_1` FOREIGN KEY (`id_conto`) REFERENCES `conto` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
