-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 17, 2016 at 08:19 AM
-- Server version: 5.5.46-0ubuntu0.14.04.2
-- PHP Version: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `bully`
--

-- --------------------------------------------------------

--
-- Table structure for table `child`
--

CREATE TABLE IF NOT EXISTS `child` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `child_name` varchar(255) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `district` varchar(255) NOT NULL,
  `school` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `allow_login` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=92 ;

--
-- Dumping data for table `child`
--

INSERT INTO `child` (`id`, `child_name`, `parent_id`, `district`, `school`, `username`, `password`, `allow_login`) VALUES
(1, 'rajesh', 3, 'mohali', 'Blue', '', '', 0),
(2, 'Harsh', 3, 'mohali', 'Blue', '', '', 0),
(3, 'third', 3, 'panchkula', 'Green', '', '', 0),
(4, 'fourth user', 3, 'chandigarh', 'Green', '', '', 0),
(5, 'test', 4, 'chandigarh', 'Blue', '', '', 0),
(6, 'fifth', 3, 'mohali', 'Blue', '', '', 0),
(7, 'sixth', 3, 'chandigarh', 'Blue', '', '', 0),
(8, 'seventh', 3, 'chandigarh', 'Blue', '', '', 0),
(9, 'Eight', 3, 'chandigarh', 'Green', '', '', 0),
(10, 'ninth', 3, 'mohali', 'Blue', '', '', 0),
(13, 'tes', 6, 'chandigarh', 'Blue', '', '', 0),
(14, 'test', 3, 'chandigarh', 'Red', '', '', 0),
(15, 'tdfyfyfyf', 3, 'mohali', 'Green', '', '', 0),
(16, 'okay', 3, 'chandigarh', 'Red', '', '', 0),
(17, 'test', 7, 'chandigarh', 'Green', '', '', 0),
(18, 'first child', 9, 'mohali', 'Green', '', '', 0),
(19, 'second child', 9, 'chandigarh', 'Green', '', '', 0),
(20, 'Juliet', 10, 'chandigarh', 'Blue', '', '', 0),
(21, 'jjhj', 3, 'mohali', 'Green', '', '', 0),
(22, 'dgfgfdgf', 0, 'mohali', 'Blue', '123', '202cb962ac59075b964b07152d234b70', 1),
(23, 'hgfhfg', 3, 'mohali', 'Green', 'test', '', 1),
(24, 'testy', 3, 'mohali', 'Green', 'test', '202cb962ac59075b964b07152d234b70', 1),
(25, 'Spoilt child', 11, 'chandigarh', 'Blue', '', '', 0),
(26, 'John', 12, 'chandigarh', 'Blue', '', '', 0),
(27, 'Mike', 14, 'chandigarh', 'Red', '', '', 0),
(28, 'rah', 17, 'panchkula', 'Red', 'raj', '202cb962ac59075b964b07152d234b70', 1),
(29, 'john deo', 12, 'chandigarh', 'Blue', 'john', '73cd90231b14ea0bb67f661ed947ac72', 1),
(30, 'john deo', 12, 'chandigarh', 'Blue', 'john', '73cd90231b14ea0bb67f661ed947ac72', 0),
(31, 'john deo', 12, 'chandigarh', 'Blue', 'john', 'a883bde368145d717b99c70594fd6069', 1),
(32, 'New', 12, 'mohali', 'Red', 'New', '22af645d1859cb5ca6da0c484f1f37ea', 1),
(33, 'New', 12, 'mohali', 'Red', 'New', '22af645d1859cb5ca6da0c484f1f37ea', 0),
(34, 'test', 12, 'mohali', 'Blue', 'test child', '098f6bcd4621d373cade4e832627b4f6', 1),
(35, 'aa', 32, 'mohali', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(36, 'aa', 32, 'mohali', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(37, 'aasdas', 12, 'mohali', 'Green', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(38, 'gfdsgf', 12, 'mohali', 'Green', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(39, 'asd', 12, 'chandigarh', 'Green', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(40, 'asdad', 12, 'panchkula', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(41, 'asdasd', 12, 'panchkula', 'Green', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(42, 'child name', 32, 'chandigarh', 'Red', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(43, 'child name', 32, 'chandigarh', 'Red', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(44, 'child name', 32, 'chandigarh', 'Red', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(45, 'child name', 32, 'chandigarh', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(46, 'child name', 32, 'chandigarh', 'Green', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(47, 'child-name', 19, 'mohali', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(48, 'child-name', 19, 'mohali', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(49, 'child-name', 19, 'mohali', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(50, 'kid-name', 19, 'mohali', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(51, 'abcname', 12, 'mohali', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(52, 'newchild01', 20, 'mohali', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(53, 'baby', 20, 'mohali', 'Blue', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(54, 'baby2', 20, 'chandigarh', 'Delhi Public School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(55, 'baby3', 20, 'chandigarh', 'Delhi Public School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(56, '1', 20, 'mohali', 'Carmel Convent School', '1', 'c4ca4238a0b923820dcc509a6f75849b', 0),
(57, '2', 20, 'mohali', 'Carmel Convent School', '2', 'c81e728d9d4c2f636f067f89cc14862c', 0),
(58, '3', 20, 'chandigarh', 'Carmel Convent School', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(59, '4', 20, 'mohali', 'Delhi Public School', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(60, 'ab', 20, 'mohali', 'Carmel Convent School', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(61, '5', 20, 'chandigarh', 'Carmel Convent School', '5', 'e4da3b7fbbce2345d7772b0674a318d5', 0),
(62, '6', 20, 'mohali', 'Delhi Public School', '6', '1679091c5a880faf6fb5e6087eb1b2dc', 1),
(63, '1', 20, 'chandigarh', 'Delhi Public School', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(64, '1', 20, 'mohali', 'Carmel Convent School', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(65, '1', 20, 'mohali', 'Delhi Public School', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(66, '1', 20, 'chandigarh', 'Delhi Public School', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(67, '12', 20, 'chandigarh', 'Delhi Public School', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(68, '1', 20, 'mohali', 'Carmel Convent School', '', 'd41d8cd98f00b204e9800998ecf8427e', 1),
(69, '1', 20, 'chandigarh', 'Delhi Public School', '1', 'c4ca4238a0b923820dcc509a6f75849b', 1),
(70, 'sasa', 20, 'mohali', 'Carmel Convent School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(71, '12', 20, 'mohali', 'Carmel Convent School', '12', 'c20ad4d76fe97759aa27a0c99bff6710', 0),
(72, '1', 20, 'chandigarh', 'Carmel Convent School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(73, '12', 20, 'panchkula', 'Capital Model High School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(74, '12', 20, 'panchkula', 'Capital Model High School', '12', 'c20ad4d76fe97759aa27a0c99bff6710', 1),
(75, '12', 20, 'panchkula', 'Capital Model High School', '12', 'c20ad4d76fe97759aa27a0c99bff6710', 1),
(76, 'Nitasha', 21, 'California', 'Fairmont', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(77, 'Gkztksti', 23, 'California', 'Greenville High School', 'Ggg', '28e77100cb96d7b9a3fd66e3930e9bbe', 0),
(78, 'Gkztksti', 23, 'Butler County', 'Georgiana School', 'Ggg', '28e77100cb96d7b9a3fd66e3930e9bbe', 0),
(79, 'Ok kydkyd', 24, 'Coffee County', 'Georgiana School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(80, 'Utzjtdjtsy', 24, 'Butler County', 'Greenville High School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(81, 'Itsiydiy', 24, 'Butler County', 'Kinston High School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(82, 'Test', 24, 'Butler County', 'Greenville High School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(83, 'Chcuch', 25, 'California', 'Greenville High School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(84, 'Chcuch', 25, 'California', 'Greenville High School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(85, 'Shalini', 26, 'Coffee County', 'Georgiana School', 'Hslanana', 'e10adc3949ba59abbe56e057f20f883e', 1),
(86, 'Yahoo', 30, 'Butler County', 'Greenville High School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(87, 'Yahoo', 30, 'Butler County', 'Greenville High School', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(88, 'Jhhhh', 30, 'California', 'Fairmont', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(89, 'Jhhhh', 30, 'California', 'Fairmont', '', 'd41d8cd98f00b204e9800998ecf8427e', 0),
(90, 'Sally', 31, 'California', 'Fairmont', 'Sally', 'b8bba2baae4c2a08fdff4e223458577d', 1),
(91, 'Sally', 31, 'California', 'Fairmont', 'Sally', 'b8bba2baae4c2a08fdff4e223458577d', 1);

-- --------------------------------------------------------

--
-- Table structure for table `child_behaviour`
--

CREATE TABLE IF NOT EXISTS `child_behaviour` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `child_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `status_date` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `child_behaviour`
--

INSERT INTO `child_behaviour` (`id`, `child_id`, `parent_id`, `status`, `reason`, `status_date`) VALUES
(1, 2, 3, 'ok', '', '2016-06-14'),
(2, 13, 6, 'bully', 'dfdfdfsf', '2016-06-14'),
(3, 6, 3, 'sad', 'sad', '2016-06-15'),
(4, 3, 3, 'sad', 'ghfhgfhfg', '2016-06-15'),
(5, 6, 3, 'bully', 'Hello', '2016-06-16'),
(6, 2, 3, 'bully', '', '2016-06-16'),
(7, 4, 3, 'sad', 'Txxrf', '2016-06-16'),
(8, 1, 3, 'ok', 'dfdfsd', '2016-06-17'),
(9, 2, 3, 'bully', 'dffdfdf', '2016-06-17'),
(10, 1, 3, 'bully', '', '2016-06-18'),
(11, 17, 7, 'bully', 'fgfdggdgd', '2016-06-23'),
(12, 17, 7, 'mad', 'ghghgfhg', '2016-06-24'),
(13, 18, 9, 'bully', 'Bully Day', '2016-06-24'),
(14, 18, 9, 'sad', 'Reason', '2016-06-25'),
(15, 19, 9, 'happy', '', '2016-06-28'),
(16, 18, 9, 'happy', '', '2016-06-28'),
(17, 20, 10, 'bully', '', '2016-06-29'),
(18, 2, 3, 'sad', '', '2016-07-02'),
(19, 1, 3, 'happy', '', '2016-07-02'),
(20, 6, 3, 'bully', 'Ghhhjjj', '2016-07-02'),
(21, 26, 12, 'happy', 'test reason', '2016-10-05'),
(22, 27, 14, 'happy', 'Happy', '2016-10-05'),
(23, 28, 17, 'bully', 'fdfddfdd', '2016-10-12'),
(24, 26, 12, 'mad', '', '2016-10-12'),
(25, 0, 32, 'happy', '', '2016-10-12'),
(26, 0, 32, '', '', '2016-10-13'),
(27, 49, 19, 'happy', '', '2016-10-13'),
(28, 32, 0, 'bully', '', '2016-10-13'),
(29, 0, 12, 'bully', '', '2016-10-13'),
(30, 51, 12, 'bully', '', '2016-10-13'),
(31, 26, 12, 'happy', '', '2016-10-13'),
(32, 52, 20, 'bully', '', '2016-10-13'),
(33, 74, 20, 'happy', '', '2016-10-13'),
(34, 76, 21, 'mad', 'Hello', '2016-10-14'),
(35, 30, 12, 'ok', '', '2016-10-14'),
(36, 77, 23, 'ok', 'Hfsjtsjt', '2016-10-18'),
(37, 79, 24, 'happy', 'Itsjtz', '2016-10-18'),
(38, 83, 25, 'bully', 'Ifxgi', '2016-10-18'),
(39, 85, 26, 'happy', 'Ggu', '2016-10-26'),
(40, 91, 31, 'ok', 'Test', '2016-11-17'),
(41, 90, 0, 'bully', '', '2016-11-17');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `fullname`) VALUES
(3, 'test', 'test123@gmail.com', '202cb962ac59075b964b07152d234b70', 'test'),
(4, 'amit sharma', 'amit@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'amit'),
(6, 'new', 'new@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'new'),
(7, 'kamal', 'kamal@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055', 'kamal'),
(8, 'ffgfd', 'test@gmail.com', '202cb962ac59075b964b07152d234b70', 'fgfdg'),
(9, 'mukesh', 'mukesh@trsoftwaregroup.com', '73cd90231b14ea0bb67f661ed947ac72', 'mukesh'),
(10, 'Tj', 'tj@simplebox.com', '098f6bcd4621d373cade4e832627b4f6', 'Tj'),
(11, 'Rayva', 'rayva@rayva.com', '76db350b2a936c11c9e8501d590bda1b', 'Rayva'),
(12, 'admin', 'admin@gmail.com', '21232f297a57a5a743894a0e4a801fc3', 'admin'),
(13, 'admin', 'admin@gmail.com', '21232f297a57a5a743894a0e4a801fc3', 'admin'),
(14, 'admin', 'admin@gmail.com', '21232f297a57a5a743894a0e4a801fc3', 'Admin'),
(15, 'Admin', 'admin@gmail.com', '21232f297a57a5a743894a0e4a801fc3', 'Admin'),
(16, 'test123', 'test1234@gmail.com', 'e10adc3949ba59abbe56e057f20f883e', 'test'),
(17, 'raj123', 'raj@gmail.com', '202cb962ac59075b964b07152d234b70', 'raj'),
(18, 'mukesh12', 'mukesh@trsoftwaregroup.com', '73cd90231b14ea0bb67f661ed947ac72', 'mukesh'),
(19, 'parent', 'parent@email.com', 'd0e45878043844ffc41aac437e86b602', 'full name'),
(20, 'newparent', 'admin90@gmail.com', 'bf3db8daf83d0034e113122d5f28b704', 'newparent'),
(21, 'Singh', 'tj@simplebox.com', '8dbdda48fb8748d6746f1965824e966a', 'Tom'),
(22, 'Harsh', 'sharmaharsh998@gmail.com', 'efe6398127928f1b2e9ef3207fb82663', 'Harsh'),
(23, 'Harsh', 'sharmaharsh998@gmail.com', 'efe6398127928f1b2e9ef3207fb82663', 'Harsh'),
(24, 'Kystj', 'jtxgjz@hdhd.com', '47bce5c74f589f4867dbd57e9ca9f808', 'Yodyi'),
(25, 'Cvc', 'ccc@ff.com', 'b2ca678b4c936f905fb82f2733f5297f', 'Fhhff'),
(26, 'shalinikat', 'shalini.webethics@gmail.com', 'f6e5d1ca442613a6308762fbc4dc6600', 'Shalini'),
(27, 'Fjzgks', 'kydyk@gh.com', '343b1c4a3ea721b2d640fc8700db0f36', 'Kydkyd'),
(28, 'Ghg', 'bshb@de.com', '343b1c4a3ea721b2d640fc8700db0f36', 'Hhh'),
(29, 'Bbb', 'bhh@ds.com', '6d2fe1d6f097816949a2f54ed3d986a8', 'Dhdh'),
(30, 'Bbb', 'bhh@ds.com', '6d2fe1d6f097816949a2f54ed3d986a8', 'Dhdh'),
(31, 'Tjsehmi', 'tj@tj.com', 'b5fefe2629b169a7a600f0d25df1b9f1', 'Tom');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
