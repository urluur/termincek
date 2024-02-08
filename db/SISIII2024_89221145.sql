-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Jan 17, 2024 at 09:44 AM
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

--
-- Dumping data for table `Delavec`
--

INSERT INTO `Delavec` (`delavec_id`, `delavec_ime`, `delavec_priimek`, `delavec_slika`, `delavec_eposta`, `delavec_geslo`, `delavec_telefon`, `podjetje_id`) VALUES
(1, 'Simon', 'Plesa', 'https://www.psypost.org/wp-content/uploads/2020/04/bald-man.jpg', 'simonplesa@gmail.com', '$2b$10$97rJCXFc7jQTy51pN4bqSu1x0AcwxDSjqKy41EMeDhRoPf2Ao20Yy', '069 669 420', 1);

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

--
-- Dumping data for table `Podjetje`
--

INSERT INTO `Podjetje` (`podjetje_id`, `podjetje_naziv`, `podjetje_admin`, `podjetje_geslo`, `podjetje_naslov`, `podjetje_slika`) VALUES
(0, 'Terminček', 'termincek', '0', '0', 'https://i.imgur.com/xH27nrm.png'),
(1, 'Frizerski salon Pleša', 'plesa', '$2b$10$S99aw2ei3DMG5te31GbmvOwqyeVb0AQdL/qi6n0B518neabyV3l6i', 'Glavna ulica 1, 1000 Ljubljana, Slovenija', 'https://i.pinimg.com/originals/24/1d/6e/241d6eca8be9843e4347fd76ff002315.jpg');

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

--
-- Dumping data for table `Storitev`
--

INSERT INTO `Storitev` (`storitev_id`, `storitev_ime`, `storitev_opis`, `storitev_slika`, `storitev_cena`, `storitev_trajanje`, `podjetje_id`) VALUES
(1, 'Prost dan', NULL, NULL, '0.00', 1440, 0),
(2, '12 prostih ur', NULL, NULL, '0.00', 720, 0),
(3, '6 prostih ur', NULL, NULL, '0.00', 360, 0),
(4, '3 proste ure', NULL, NULL, '0.00', 180, 0),
(5, '1 prosta ura', NULL, NULL, '0.00', 60, 0),
(6, '1/2 proste ure', NULL, NULL, '0.00', 30, 0),
(7, '1/4 proste ure', NULL, NULL, '0.00', 15, 0),
(10, 'Striženje - Kratki lasje', 'Striženje las krajših od 10cm', 'https://www.sensod.com/images/media/m/28/mens-short-hair-cut-with-spike-2017-short-haircut-for-men-fade-messy-faux-hawk-men-hairstyle-2018072809563377_large.jpg', '20.00', 30, 1),
(11, 'Striženje - Srednje dolgi lasje', 'Striženje las, med 10cm in 30cm', 'https://i.pinimg.com/originals/27/9f/21/279f2116b269995afbddd31bd8245dc4.jpg', '35.00', 45, 1),
(12, 'Striženje - Dolgi lasje', 'Striženje las, med 30cm in 50cm', 'https://www.bestlonghairstyles.com/wp-content/uploads/2021/03/11-long-hairstyles-for-women-1203202180011.jpg', '45.00', 60, 1),
(13, 'Striženje - Extra dolgi lasje', 'Striženje las, daljših od 50cm', 'https://i.pinimg.com/736x/24/54/74/245474ec1ea9519093cf4145fb886d13.jpg', '50.00', 80, 1),
(14, 'Mašinca', 'Striženje las \"na mašinco\" do 3cm', 'https://www.menshairstyletrends.com/wp-content/uploads/2023/06/Mid-fade-buzz-cut-with-designs-bcfbarbering.jpg', '10.00', 20, 1),
(15, 'Striženje franže', 'Striženje konic franže oz. fru fru', 'https://hairstylesweekly.com/images/2018/01/unnamed-file-42.jpg', '5.00', 15, 1),
(16, 'Otroško striženje', 'Otroško striženje za dečke in deklice', 'http://www.mykidsite.com/wp-content/uploads/2013/05/Girl-With-Boy.jpg', '10.00', 30, 1),
(17, 'Likanje las', 'Ravnanje las z frizerskim likalnikom', 'https://images.pexels.com/photos/3738359/pexels-photo-3738359.jpeg', '17.00', 20, 1),
(18, 'Barvanje', 'Barvanje moških ali ženskih las', 'https://ninjacosmico.com/wp-content/uploads/2017/12/dyedhair23.jpg', '45.00', 60, 1),
(19, 'Beljenje', 'Beljenje las', 'https://content.latest-hairstyles.com/wp-content/uploads/white-platinum-blonde-hair-color.jpg', '35.00', 50, 1),
(20, 'Prameni - Pol glave', 'Barvanje polovice dolžine las', 'https://i0.wp.com/hottesthaircuts.com/wp-content/uploads/2018/01/3.-Dark-to-Light-Ombre-Straight-Hair.jpg', '45.00', 120, 1),
(21, 'Prameni - cela glava', 'Barvanje ombrov po celotni dolžini las', 'https://www.colouredhaircare.com/wp-content/uploads/2020/05/ombre.jpeg', '100.00', 150, 1),
(22, '\"Na plešo prosm\"', 'Ukradite stil od najboljšega frizerja', 'https://i.pinimg.com/originals/9d/f5/9f/9df59f2cddbb0054aa0df2a4e145f8bc.jpg', '0.00', 15, 1);

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
(0, 'Ponedeljek', 'pon.', 'pon', '0', '0', NULL),
(1, 'Torek', 'tor.', 'tor', '0', '0', NULL),
(2, 'Sreda', 'sre.', 'sre', '0', '0', NULL),
(3, 'Četrtek', 'cet.', 'cet', '0', '0', NULL),
(4, 'Petek', 'pet.', 'pet', '0', '0', NULL),
(5, 'Sobota', 'sob.', 'sob', '0', '0', NULL),
(6, 'Nedelja', 'ned.', 'ned', '0', '0', NULL),
(7, 'Luka', 'Uršič', 'luka.urs@icloud.com', '$2b$10$ze8kM1OUtjrL79VLDnRB.eEaZp61coQ9sDmOk3yJ2sIKrgmmKR0IW', '041 88 44 41', NULL);

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
  MODIFY `delavec_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Narocilo`
--
ALTER TABLE `Narocilo`
  MODIFY `narocilo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `Podjetje`
--
ALTER TABLE `Podjetje`
  MODIFY `podjetje_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Storitev`
--
ALTER TABLE `Storitev`
  MODIFY `storitev_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `Stranka`
--
ALTER TABLE `Stranka`
  MODIFY `stranka_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
