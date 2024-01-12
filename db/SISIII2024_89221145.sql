-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jan 09, 2024 at 12:39 PM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `SISIII2024_89221145`
--

-- --------------------------------------------------------

--
-- Table structure for table `Delavec`
--

CREATE TABLE `Delavec` (
  `delavec_id` int(11) NOT NULL,
  `delavec_ime` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `delavec_priimek` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `delavec_slika` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `delavec_eposta` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `delavec_geslo` char(60) COLLATE utf8_unicode_ci NOT NULL,
  `delavec_telefon` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `podjetje_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Narocilo`
--

CREATE TABLE `Narocilo` (
  `narocilo_id` int(11) NOT NULL,
  `narocilo_cas` datetime NOT NULL,
  `narocilo_opombe` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `stranka_id` int(11) DEFAULT NULL,
  `delavec_id` int(11) NOT NULL,
  `storitev_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Podjetje`
--

CREATE TABLE `Podjetje` (
  `podjetje_id` int(11) NOT NULL,
  `podjetje_naziv` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `podjetje_admin` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `podjetje_geslo` char(60) COLLATE utf8_unicode_ci NOT NULL,
  `podjetje_naslov` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `podjetje_slika` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Storitev`
--

CREATE TABLE `Storitev` (
  `storitev_id` int(11) NOT NULL,
  `storitev_ime` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `storitev_opis` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `storitev_slika` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `storitev_cena` decimal(10,2) NOT NULL,
  `storitev_trajanje` int(11) NOT NULL,
  `podjetje_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Stranka`
--

CREATE TABLE `Stranka` (
  `stranka_id` int(11) NOT NULL,
  `stranka_ime` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `stranka_priimek` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `stranka_eposta` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `stranka_geslo` char(60) COLLATE utf8_unicode_ci NOT NULL,
  `stranka_telefon` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `stranka_opombe` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `Stranka`
--

INSERT INTO `Stranka` (`stranka_id`, `stranka_ime`, `stranka_priimek`, `stranka_eposta`, `stranka_geslo`, `stranka_telefon`, `stranka_opombe`) VALUES
(1, 'Ponedeljek', 'pon.', 'pon', '0', '0', NULL),
(2, 'Torek', 'tor.', 'tor', '0', '0', NULL),
(3, 'Sreda', 'sre.', 'sre', '0', '0', NULL),
(4, 'Četrtek', 'cet.', 'cet', '0', '0', NULL),
(5, 'Petek', 'pet.', 'pet', '0', '0', NULL),
(6, 'Sobota', 'sob.', 'sob', '0', '0', NULL),
(7, 'Nedelja', 'ned.', 'ned', '0', '0', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Delavec`
--
ALTER TABLE `Delavec`
  ADD PRIMARY KEY (`delavec_id`),
  ADD UNIQUE KEY `delavec_eposta` (`delavec_eposta`),
  ADD KEY `podjetje_id` (`podjetje_id`);

--
-- Indexes for table `Narocilo`
--
ALTER TABLE `Narocilo`
  ADD PRIMARY KEY (`narocilo_id`),
  ADD KEY `storitev_id` (`storitev_id`),
  ADD KEY `delavec_id` (`delavec_id`),
  ADD KEY `stranka_id` (`stranka_id`);

--
-- Indexes for table `Podjetje`
--
ALTER TABLE `Podjetje`
  ADD PRIMARY KEY (`podjetje_id`),
  ADD UNIQUE KEY `podjetje_admin` (`podjetje_admin`);

--
-- Indexes for table `Storitev`
--
ALTER TABLE `Storitev`
  ADD PRIMARY KEY (`storitev_id`),
  ADD KEY `podjetje_id` (`podjetje_id`);

--
-- Indexes for table `Stranka`
--
ALTER TABLE `Stranka`
  ADD PRIMARY KEY (`stranka_id`),
  ADD UNIQUE KEY `stranka_eposta` (`stranka_eposta`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Delavec`
--
ALTER TABLE `Delavec`
  MODIFY `delavec_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Narocilo`
--
ALTER TABLE `Narocilo`
  MODIFY `narocilo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Podjetje`
--
ALTER TABLE `Podjetje`
  MODIFY `podjetje_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Storitev`
--
ALTER TABLE `Storitev`
  MODIFY `storitev_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Stranka`
--
ALTER TABLE `Stranka`
  MODIFY `stranka_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Delavec`
--
ALTER TABLE `Delavec`
  ADD CONSTRAINT `Delavec_ibfk_1` FOREIGN KEY (`podjetje_id`) REFERENCES `Podjetje` (`podjetje_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Narocilo`
--
ALTER TABLE `Narocilo`
  ADD CONSTRAINT `Narocilo_ibfk_1` FOREIGN KEY (`stranka_id`) REFERENCES `Stranka` (`stranka_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Narocilo_ibfk_2` FOREIGN KEY (`delavec_id`) REFERENCES `Delavec` (`delavec_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `Narocilo_ibfk_3` FOREIGN KEY (`storitev_id`) REFERENCES `Storitev` (`storitev_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `Storitev`
--
ALTER TABLE `Storitev`
  ADD CONSTRAINT `Storitev_ibfk_1` FOREIGN KEY (`podjetje_id`) REFERENCES `Podjetje` (`podjetje_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
