-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql-db
-- Generation Time: Dec 24, 2024 at 06:30 AM
-- Server version: 8.0.39
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mommom_food`
--

-- --------------------------------------------------------

--
-- Table structure for table `Categories`
--

CREATE TABLE `Categories` (
  `category_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Categories`
--

INSERT INTO `Categories` (`category_id`, `name`, `description`, `image_url`, `is_active`) VALUES
(1, 'Bún/Phở', 'Các món bún và phở truyền thống Việt Nam', NULL, 1),
(2, 'Cơm', 'Các món cơm đặc sắc', NULL, 1),
(3, 'Đồ uống', 'Các loại thức uống giải khát', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `OrderDetails`
--

CREATE TABLE `OrderDetails` (
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,3) NOT NULL,
  `subtotal` decimal(10,3) GENERATED ALWAYS AS ((`quantity` * `unit_price`)) STORED,
  `note` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `OrderDetails`
--

INSERT INTO `OrderDetails` (`order_id`, `product_id`, `quantity`, `unit_price`, `note`) VALUES
(7, 3, 10, 1.000, NULL),
(7, 4, 7, 20.000, NULL),
(7, 5, 1, 10.000, NULL),
(7, 7, 1, 12.000, NULL),
(7, 11, 1, 17.000, NULL),
(15, 4, 4, 20.000, NULL),
(15, 9, 4, 10.000, NULL),
(16, 4, 1, 20.000, NULL),
(17, 5, 7, 10.000, NULL),
(18, 4, 1, 20.000, NULL),
(19, 4, 1, 20.000, NULL),
(20, 5, 6, 10.000, NULL),
(21, 4, 4, 20.000, NULL),
(22, 4, 1, 20.000, NULL),
(22, 7, 1, 12.000, NULL),
(23, 4, 1, 20.000, NULL),
(24, 4, 1, 20.000, NULL),
(24, 5, 1, 10.000, NULL),
(25, 4, 1, 20.000, NULL),
(26, 4, 1, 20.000, NULL),
(27, 3, 1, 1.000, NULL),
(27, 4, 3, 20.000, NULL),
(27, 10, 1, 15.000, NULL),
(28, 4, 1, 20.000, NULL),
(30, 4, 1, 20.000, NULL),
(31, 4, 1, 20.000, NULL),
(32, 4, 1, 20.000, NULL),
(34, 3, 1, 1.000, NULL),
(34, 4, 1, 20.000, NULL),
(35, 5, 3, 10.000, NULL),
(36, 5, 1, 10.000, NULL),
(36, 6, 1, 15.000, NULL),
(37, 6, 1, 15.000, NULL),
(38, 7, 1, 12.000, NULL),
(39, 4, 1, 20.000, NULL),
(39, 9, 1, 10.000, NULL),
(40, 6, 1, 15.000, NULL),
(41, 4, 1, 20.000, NULL),
(42, 5, 1, 10.000, NULL),
(43, 4, 1, 20.000, NULL),
(43, 5, 1, 10.000, NULL),
(44, 4, 3, 20.000, NULL),
(44, 6, 3, 15.000, NULL),
(45, 4, 1, 20.000, NULL),
(46, 4, 1, 20.000, NULL),
(47, 4, 1, 20.000, NULL),
(48, 4, 1, 20.000, NULL),
(48, 5, 2, 10.000, NULL),
(48, 6, 3, 15.000, NULL),
(49, 4, 3, 20.000, NULL),
(49, 5, 2, 10.000, NULL),
(49, 6, 3, 15.000, NULL),
(50, 4, 3, 20.000, NULL),
(50, 5, 2, 10.000, NULL),
(50, 6, 3, 15.000, NULL),
(51, 4, 5, 20.000, NULL),
(51, 5, 2, 10.000, NULL),
(51, 6, 3, 15.000, NULL),
(52, 4, 3, 20.000, NULL),
(52, 5, 2, 10.000, NULL),
(52, 6, 3, 15.000, NULL),
(53, 3, 3, 1.000, NULL),
(53, 4, 3, 20.000, NULL),
(54, 3, 3, 1.000, NULL),
(54, 4, 1, 20.000, NULL),
(59, 10, 4, 15.000, NULL),
(60, 4, 1, 20.000, NULL),
(60, 5, 3, 10.000, NULL),
(61, 4, 9, 20.000, NULL),
(62, 5, 1, 10.000, NULL),
(63, 4, 3, 20.000, NULL),
(63, 5, 3, 10.000, NULL),
(64, 7, 3, 12.000, NULL),
(65, 4, 13, 20.000, NULL),
(66, 4, 5, 20.000, NULL),
(67, 4, 3, 20.000, NULL),
(68, 4, 9, 20.000, NULL),
(69, 4, 6, 20.000, NULL),
(70, 8, 4, 14.000, NULL),
(72, 4, 3, 20.000, NULL),
(77, 7, 1, 12.000, NULL),
(78, 7, 1, 12.000, NULL),
(79, 4, 5, 20.000, NULL),
(83, 4, 3, 20.000, NULL),
(84, 5, 1, 10.000, NULL),
(85, 6, 3, 15.000, NULL),
(85, 10, 2, 15.000, NULL),
(86, 4, 4, 20.000, NULL),
(87, 4, 4, 20.000, NULL),
(88, 4, 4, 20.000, NULL),
(89, 4, 4, 20.000, NULL),
(90, 4, 3, 20.000, NULL),
(91, 4, 3, 20.000, NULL),
(92, 4, 3, 20.000, NULL),
(93, 4, 3, 20.000, NULL),
(94, 4, 3, 20.000, NULL),
(95, 4, 3, 20.000, NULL),
(96, 4, 3, 20.000, NULL),
(97, 4, 5, 20.000, NULL),
(98, 4, 4, 20.000, NULL),
(99, 4, 4, 20.000, NULL),
(100, 4, 5, 20.000, NULL),
(102, 4, 4, 20.000, NULL),
(103, 8, 3, 14.000, NULL),
(104, 4, 3, 20.000, NULL),
(105, 4, 3, 20.000, NULL),
(106, 4, 4, 20.000, NULL),
(107, 3, 3, 1.000, NULL),
(108, 3, 6, 1.000, NULL),
(110, 4, 3, 20.000, NULL),
(110, 8, 3, 14.000, NULL),
(111, 4, 4, 20.000, NULL),
(114, 3, 1, 1.000, NULL),
(114, 4, 3, 20.000, NULL),
(115, 4, 4, 20.000, NULL),
(115, 5, 1, 10.000, NULL),
(116, 4, 1, 20.000, NULL),
(116, 5, 1, 10.000, NULL),
(117, 6, 1, 15.000, NULL),
(117, 7, 1, 12.000, NULL),
(117, 8, 1, 14.000, NULL),
(118, 5, 1, 10.000, NULL),
(119, 5, 2, 10.000, NULL),
(120, 4, 1, 20.000, NULL),
(120, 11, 1, 17.000, NULL),
(121, 4, 1, 20.000, NULL),
(121, 7, 1, 12.000, NULL),
(121, 8, 1, 14.000, NULL),
(122, 3, 1, 1.000, NULL),
(122, 4, 1, 20.000, NULL),
(123, 5, 1, 10.000, NULL),
(123, 7, 2, 12.000, NULL),
(124, 4, 1, 20.000, NULL),
(124, 5, 1, 10.000, NULL),
(125, 4, 1, 20.000, NULL),
(125, 5, 1, 10.000, NULL),
(126, 4, 1, 20.000, NULL),
(126, 5, 1, 10.000, NULL),
(127, 4, 1, 20.000, NULL),
(128, 4, 4, 20.000, NULL),
(129, 4, 1, 20.000, NULL),
(129, 5, 1, 10.000, NULL),
(130, 4, 1, 20.000, NULL),
(130, 5, 1, 10.000, NULL),
(131, 4, 1, 20.000, NULL),
(131, 5, 1, 10.000, NULL),
(132, 5, 7, 10.000, NULL),
(132, 7, 1, 12.000, NULL),
(133, 8, 1, 14.000, NULL),
(134, 5, 1, 10.000, NULL),
(135, 4, 1, 20.000, NULL),
(136, 4, 3, 20.000, NULL),
(137, 5, 1, 10.000, NULL),
(138, 4, 2, 20.000, NULL),
(139, 10, 1, 15.000, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `order_id` int NOT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL COMMENT 'Địa chỉ đặt hàng',
  `table_id` int DEFAULT NULL,
  `staff_id` int DEFAULT NULL,
  `total_amount` decimal(10,3) NOT NULL,
  `status` enum('created','completed') DEFAULT 'created',
  `payment_method` enum('cash','card','momo') DEFAULT NULL,
  `payment_status` enum('pending','paid','failed') DEFAULT NULL,
  `note` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`order_id`, `customer_name`, `customer_phone`, `address`, `table_id`, `staff_id`, `total_amount`, `status`, `payment_method`, `payment_status`, `note`, `created_at`, `updated_at`) VALUES
(7, NULL, NULL, NULL, NULL, NULL, 189.000, 'completed', 'cash', 'pending', NULL, '2024-12-16 05:42:23', '2024-12-16 17:41:28'),
(15, NULL, NULL, NULL, NULL, NULL, 120.000, 'created', 'cash', 'pending', NULL, '2024-12-17 05:13:28', '2024-12-17 05:13:28'),
(16, NULL, NULL, NULL, NULL, NULL, 20.000, 'completed', 'cash', 'pending', NULL, '2024-12-17 05:22:11', '2024-12-18 15:27:32'),
(17, NULL, NULL, NULL, NULL, NULL, 70.000, 'created', 'cash', 'pending', NULL, '2024-12-17 05:52:38', '2024-12-17 05:52:38'),
(18, NULL, NULL, NULL, NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-17 06:04:06', '2024-12-17 06:04:06'),
(19, NULL, NULL, NULL, NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-17 09:32:44', '2024-12-17 09:32:44'),
(20, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-17 14:28:19', '2024-12-17 14:28:19'),
(21, NULL, NULL, NULL, NULL, NULL, 80.000, 'created', 'cash', 'pending', NULL, '2024-12-17 16:50:58', '2024-12-17 16:50:58'),
(22, NULL, NULL, NULL, NULL, NULL, 32.000, 'created', 'cash', 'pending', NULL, '2024-12-18 13:06:53', '2024-12-18 13:06:53'),
(23, NULL, NULL, NULL, NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-18 15:30:28', '2024-12-18 15:30:28'),
(24, NULL, NULL, NULL, NULL, NULL, 30.000, 'created', 'cash', 'pending', NULL, '2024-12-18 15:31:24', '2024-12-18 15:31:24'),
(25, NULL, NULL, NULL, NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-18 16:09:09', '2024-12-18 16:09:09'),
(26, NULL, NULL, NULL, NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-18 17:38:25', '2024-12-18 17:38:25'),
(27, NULL, NULL, NULL, NULL, NULL, 76.000, 'created', 'cash', 'pending', NULL, '2024-12-18 18:25:29', '2024-12-18 18:25:29'),
(28, NULL, NULL, NULL, NULL, NULL, 20.000, 'completed', 'cash', 'pending', NULL, '2024-12-18 18:25:41', '2024-12-19 03:38:11'),
(30, NULL, NULL, NULL, NULL, NULL, 20.000, 'completed', 'cash', 'pending', NULL, '2024-12-19 01:21:33', '2024-12-19 03:38:11'),
(31, NULL, NULL, NULL, NULL, NULL, 20.000, 'completed', 'cash', 'pending', NULL, '2024-12-19 02:09:49', '2024-12-19 03:38:10'),
(32, NULL, NULL, NULL, NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-19 02:14:56', '2024-12-19 16:01:14'),
(34, NULL, NULL, NULL, NULL, NULL, 21.000, 'created', 'cash', 'pending', NULL, '2024-12-19 03:02:57', '2024-12-19 03:02:57'),
(35, NULL, NULL, NULL, NULL, NULL, 30.000, 'completed', 'cash', 'pending', NULL, '2024-12-19 03:03:20', '2024-12-20 00:40:56'),
(36, NULL, NULL, NULL, NULL, NULL, 25.000, 'completed', 'cash', 'pending', NULL, '2024-12-19 15:53:59', '2024-12-20 00:48:05'),
(37, NULL, NULL, NULL, NULL, NULL, 15.000, 'created', 'cash', 'pending', NULL, '2024-12-20 00:47:54', '2024-12-20 00:55:29'),
(38, NULL, NULL, NULL, NULL, NULL, 12.000, 'created', 'cash', 'pending', NULL, '2024-12-20 00:52:07', '2024-12-20 00:55:23'),
(39, NULL, NULL, NULL, NULL, NULL, 0.000, 'created', 'cash', 'pending', NULL, '2024-12-20 00:55:36', '2024-12-20 00:55:36'),
(40, NULL, NULL, NULL, NULL, NULL, 15.000, 'created', 'cash', 'pending', NULL, '2024-12-20 00:57:46', '2024-12-20 00:59:38'),
(41, NULL, NULL, NULL, NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-20 00:59:27', '2024-12-20 00:59:27'),
(42, NULL, NULL, NULL, NULL, NULL, 10.000, 'created', 'cash', 'pending', NULL, '2024-12-20 01:02:13', '2024-12-20 01:02:13'),
(43, NULL, NULL, NULL, NULL, NULL, 30.000, 'completed', 'cash', 'pending', NULL, '2024-12-20 01:02:19', '2024-12-20 15:11:13'),
(44, NULL, NULL, NULL, NULL, NULL, 105.000, 'created', 'cash', 'pending', NULL, '2024-12-20 01:02:33', '2024-12-20 15:57:08'),
(45, NULL, NULL, NULL, NULL, NULL, 20.000, 'completed', 'cash', 'pending', NULL, '2024-12-20 15:11:24', '2024-12-20 16:10:15'),
(46, 'sa', 'sad', 'dsasad', NULL, NULL, 20.000, 'completed', 'cash', 'pending', NULL, '2024-12-20 15:55:36', '2024-12-20 16:17:22'),
(47, 'sdfds', 'dsfdsf', 'Mang về', NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-20 16:09:21', '2024-12-20 16:17:29'),
(48, 'xsx', '0966828682', 'Mang về', NULL, NULL, 85.000, 'completed', 'cash', 'pending', NULL, '2024-12-20 16:11:13', '2024-12-20 16:20:35'),
(49, 'xsx', '0966828682', 'Mang về', NULL, NULL, 125.000, 'created', 'cash', 'pending', NULL, '2024-12-20 16:22:15', '2024-12-20 16:22:15'),
(50, 'xsx', '0966828682', 'Mang về', NULL, NULL, 125.000, 'created', 'cash', 'pending', NULL, '2024-12-20 16:22:24', '2024-12-20 16:22:24'),
(51, 'xsx', '0966828682', 'Mang về', NULL, NULL, 165.000, 'created', 'cash', 'pending', NULL, '2024-12-20 16:22:35', '2024-12-20 16:28:21'),
(52, 'xsx', '0966828682', 'Mang về', NULL, NULL, 125.000, 'completed', 'cash', 'pending', NULL, '2024-12-20 16:23:44', '2024-12-20 16:28:26'),
(53, NULL, NULL, NULL, NULL, NULL, 63.000, 'created', 'cash', 'pending', NULL, '2024-12-20 16:29:25', '2024-12-20 16:29:25'),
(54, 'nam', '0966828682', 'Mang về', NULL, NULL, 23.000, 'created', 'cash', 'pending', NULL, '2024-12-20 16:37:33', '2024-12-20 16:37:33'),
(59, 'dfdsfdfs', '02323232323', 'Mang về', NULL, NULL, 60.000, 'completed', 'cash', 'pending', NULL, '2024-12-20 16:43:10', '2024-12-20 16:43:22'),
(60, 'dfssdf', 'dsfdsf', 'Mang về', NULL, NULL, 50.000, 'created', 'cash', 'pending', NULL, '2024-12-20 16:48:56', '2024-12-20 16:48:56'),
(61, 'helo', '34254543543', 'sfgdgfggfdg', NULL, NULL, 180.000, 'created', 'cash', 'pending', NULL, '2024-12-20 16:58:33', '2024-12-20 16:58:33'),
(62, 'dfdf', '0966828682', 'Mang về', NULL, NULL, 10.000, 'created', 'cash', 'pending', NULL, '2024-12-20 17:08:42', '2024-12-20 17:08:42'),
(63, 'sdfsdfsdf', 'sdfsdffsd', 'dfsdfsdfs', NULL, NULL, 90.000, 'created', 'cash', 'pending', NULL, '2024-12-20 17:10:02', '2024-12-20 17:10:02'),
(64, 'heeh', '0966828682', 'hải dương', NULL, NULL, 36.000, 'created', 'cash', 'pending', NULL, '2024-12-20 17:12:29', '2024-12-20 17:12:45'),
(65, 'dfdssdf', 'dfsdf', 'fđfdkgkgj', NULL, NULL, 260.000, 'created', 'cash', 'pending', NULL, '2024-12-20 17:19:59', '2024-12-20 18:17:12'),
(66, NULL, NULL, NULL, NULL, NULL, 100.000, 'created', 'cash', 'pending', NULL, '2024-12-20 17:20:23', '2024-12-20 17:23:47'),
(67, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 02:40:12', '2024-12-21 02:40:12'),
(68, 'nam', '0966828682', 'fdfđfsdfs', NULL, NULL, 180.000, 'created', 'cash', 'pending', NULL, '2024-12-21 02:51:26', '2024-12-21 02:51:26'),
(69, NULL, NULL, NULL, NULL, NULL, 120.000, 'created', 'cash', 'pending', NULL, '2024-12-21 02:54:50', '2024-12-21 02:54:50'),
(70, NULL, NULL, NULL, NULL, NULL, 56.000, 'created', 'cash', 'pending', NULL, '2024-12-21 02:55:24', '2024-12-21 02:55:24'),
(72, 'fgdf', '0966828682', 'dsfdsds', NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:04:09', '2024-12-21 03:04:09'),
(77, 'sđsf', '0966828682', 'Lấy tại quán', NULL, NULL, 12.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:11:40', '2024-12-21 03:11:40'),
(78, NULL, NULL, NULL, NULL, NULL, 12.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:12:22', '2024-12-21 03:12:22'),
(79, 'dfgđ', '0966828682', 'fdfdfg', NULL, NULL, 100.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:18:26', '2024-12-21 03:18:26'),
(83, 'sdfsdf', '0966828682', 'Mang về', NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:40:23', '2024-12-21 03:40:23'),
(84, NULL, NULL, NULL, NULL, NULL, 10.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:40:39', '2024-12-21 03:40:39'),
(85, 'dfff', '0966828682', 'Mang về', NULL, NULL, 75.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:44:15', '2024-12-21 03:44:15'),
(86, 'dsffsd', '0966828682', 'Mang về', NULL, NULL, 80.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:48:42', '2024-12-21 03:48:42'),
(87, 'dsffsd', '0966828682', 'Mang về', NULL, NULL, 80.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:49:43', '2024-12-21 03:49:43'),
(88, 'dsffsd', '0966828682', 'Mang về', NULL, NULL, 80.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:50:59', '2024-12-21 03:51:34'),
(89, 'dsffsd', '0966828682', 'Mang về', NULL, NULL, 80.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:52:10', '2024-12-21 03:52:10'),
(90, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:53:03', '2024-12-21 03:53:03'),
(91, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:53:41', '2024-12-21 03:53:41'),
(92, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:54:19', '2024-12-21 03:54:19'),
(93, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:57:07', '2024-12-21 03:57:07'),
(94, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 03:57:25', '2024-12-21 03:57:25'),
(95, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 04:02:09', '2024-12-21 04:02:09'),
(96, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 04:02:48', '2024-12-21 04:02:48'),
(97, NULL, NULL, NULL, NULL, NULL, 100.000, 'created', 'cash', 'pending', NULL, '2024-12-21 04:02:56', '2024-12-21 04:02:56'),
(98, 'dfsdfs', '0966828682', 'fsđfsfsd', NULL, NULL, 80.000, 'created', 'cash', 'pending', NULL, '2024-12-21 04:03:10', '2024-12-21 04:03:10'),
(99, 'dfsdfs', '0966828682', 'fsđfsfsd', NULL, NULL, 80.000, 'completed', 'cash', 'pending', NULL, '2024-12-21 04:03:31', '2024-12-21 09:31:51'),
(100, NULL, NULL, NULL, NULL, NULL, 100.000, 'created', 'cash', 'pending', NULL, '2024-12-21 04:06:34', '2024-12-21 04:06:34'),
(102, 'dfsdsf', '0966828682', 'fg', NULL, NULL, 80.000, 'completed', 'cash', 'pending', NULL, '2024-12-21 04:09:55', '2024-12-21 09:31:49'),
(103, NULL, NULL, NULL, NULL, NULL, 42.000, 'created', 'cash', 'pending', NULL, '2024-12-21 04:10:03', '2024-12-21 04:10:03'),
(104, NULL, NULL, NULL, NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-21 04:17:48', '2024-12-21 04:17:48'),
(105, 'dgdf', '0966828682', 'Mang về', NULL, NULL, 60.000, 'completed', 'cash', 'pending', NULL, '2024-12-21 09:17:39', '2024-12-21 09:31:48'),
(106, NULL, NULL, NULL, NULL, NULL, 80.000, 'completed', 'cash', 'pending', NULL, '2024-12-21 09:17:42', '2024-12-21 09:31:42'),
(107, 'rtty', '0966828682', 'Mang về', NULL, NULL, 3.000, 'completed', 'cash', 'pending', NULL, '2024-12-21 09:31:06', '2024-12-21 09:31:46'),
(108, NULL, NULL, NULL, NULL, NULL, 6.000, 'completed', 'cash', 'pending', NULL, '2024-12-21 09:31:10', '2024-12-21 09:31:33'),
(110, NULL, NULL, NULL, NULL, NULL, 102.000, 'created', 'cash', 'pending', NULL, '2024-12-21 11:44:51', '2024-12-21 11:46:51'),
(111, 'khiugjh', '0966828682', 'oliuyfh', NULL, NULL, 80.000, 'created', 'cash', 'pending', NULL, '2024-12-21 11:45:14', '2024-12-21 15:43:01'),
(114, NULL, NULL, NULL, NULL, NULL, 61.000, 'created', 'cash', 'pending', NULL, '2024-12-21 11:49:03', '2024-12-21 11:49:03'),
(115, NULL, NULL, NULL, NULL, NULL, 90.000, 'created', 'cash', 'pending', NULL, '2024-12-21 15:06:29', '2024-12-21 15:06:29'),
(116, NULL, NULL, NULL, NULL, NULL, 30.000, 'created', 'cash', 'pending', NULL, '2024-12-21 15:06:44', '2024-12-21 15:06:44'),
(117, NULL, NULL, NULL, NULL, NULL, 41.000, 'created', 'cash', 'pending', NULL, '2024-12-21 15:07:04', '2024-12-21 15:07:04'),
(118, 'ddddddđ', '0123456789', 'Mang về', NULL, NULL, 10.000, 'created', 'cash', 'pending', NULL, '2024-12-21 15:08:40', '2024-12-21 15:08:40'),
(119, NULL, NULL, NULL, NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-21 15:39:30', '2024-12-21 15:39:30'),
(120, 'gfgfgf', '0123456789', 'Mang về', NULL, NULL, 37.000, 'completed', 'cash', 'pending', NULL, '2024-12-21 15:39:51', '2024-12-21 17:07:46'),
(121, NULL, NULL, NULL, NULL, NULL, 46.000, 'completed', 'cash', 'pending', NULL, '2024-12-21 15:40:36', '2024-12-21 15:42:43'),
(122, NULL, NULL, NULL, NULL, NULL, 21.000, 'created', 'cash', 'pending', NULL, '2024-12-21 15:45:17', '2024-12-21 15:45:17'),
(123, NULL, NULL, NULL, NULL, NULL, 34.000, 'created', 'cash', 'pending', NULL, '2024-12-21 15:58:43', '2024-12-21 15:58:43'),
(124, NULL, NULL, NULL, NULL, NULL, 30.000, 'created', 'cash', 'pending', NULL, '2024-12-21 16:09:53', '2024-12-21 16:09:53'),
(125, NULL, NULL, NULL, NULL, NULL, 30.000, 'created', 'cash', 'pending', NULL, '2024-12-21 16:23:56', '2024-12-21 16:23:56'),
(126, NULL, NULL, NULL, NULL, NULL, 30.000, 'created', 'cash', 'pending', NULL, '2024-12-21 16:29:29', '2024-12-21 16:29:29'),
(127, 'jhg', '0966828682', 'jkhg', NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-21 16:29:52', '2024-12-21 16:29:52'),
(128, 'ádfgh', '0123456789', 'Mang về', NULL, NULL, 80.000, 'created', 'cash', 'pending', NULL, '2024-12-21 16:56:46', '2024-12-21 17:56:55'),
(129, NULL, NULL, NULL, NULL, NULL, 30.000, 'created', 'cash', 'pending', NULL, '2024-12-21 16:57:22', '2024-12-21 16:57:22'),
(130, NULL, NULL, NULL, NULL, NULL, 30.000, 'created', 'cash', 'pending', NULL, '2024-12-21 17:04:22', '2024-12-21 17:04:22'),
(131, NULL, NULL, NULL, NULL, NULL, 30.000, 'created', 'cash', 'pending', NULL, '2024-12-21 17:07:11', '2024-12-21 17:07:11'),
(132, 'aaaaaa', '0987654321', 'Mang về', NULL, NULL, 82.000, 'created', 'cash', 'pending', NULL, '2024-12-21 17:55:47', '2024-12-21 17:55:47'),
(133, NULL, NULL, NULL, NULL, NULL, 14.000, 'completed', 'cash', 'pending', NULL, '2024-12-21 17:55:53', '2024-12-21 17:56:34'),
(134, 'àdghjkl;\'', '0123456789', 'ádfghjkl', NULL, NULL, 10.000, 'created', 'cash', 'pending', NULL, '2024-12-21 18:05:07', '2024-12-21 18:05:07'),
(135, NULL, NULL, NULL, NULL, NULL, 20.000, 'created', 'cash', 'pending', NULL, '2024-12-21 18:05:10', '2024-12-21 18:05:10'),
(136, 'binhga', '0966828682', 'dxfgchjufchjv', NULL, NULL, 60.000, 'created', 'cash', 'pending', NULL, '2024-12-23 13:52:14', '2024-12-23 13:52:14'),
(137, 'Binh', '0347829111', 'abc', NULL, NULL, 10.000, 'created', 'cash', 'pending', NULL, '2024-12-23 16:53:51', '2024-12-23 16:53:51'),
(138, NULL, NULL, NULL, NULL, NULL, 40.000, 'created', 'cash', 'pending', NULL, '2024-12-23 16:59:23', '2024-12-23 16:59:23'),
(139, 'jhbgvdc', '0966828682', 'fdfffd', NULL, NULL, 15.000, 'created', 'cash', 'pending', NULL, '2024-12-24 03:21:34', '2024-12-24 03:21:34');

-- --------------------------------------------------------

--
-- Table structure for table `Products`
--

CREATE TABLE `Products` (
  `product_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,3) NOT NULL,
  `image_url` varchar(1000) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Products`
--

INSERT INTO `Products` (`product_id`, `category_id`, `name`, `description`, `price`, `image_url`, `is_available`, `created_at`) VALUES
(3, 2, 'd', '4', 1.000, 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1vPT99.img?w=720&h=510&m=6&x=181&y=78&s=352&d=104', 1, '2024-12-14 04:10:07'),
(4, 1, 'Phở bò', 'Phở bò truyền thống Việt Nam', 20.000, 'https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/470137547_122097395390660943_4919139303085711054_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=W2C3_3ZPuIcQ7kNvgG4-OUt&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=AAYb2B8T8uXGj-J5oDBJpeL&oh=00_AYA_pXEohDk5LB0PZYoM0w0M0ruRzrbQEGjwG1O5oRM7QQ&oe=6762F55C', 1, '2024-12-14 04:45:31'),
(5, 1, 'Bún bò huế', 'Bún bò Huế cay nồng đặc trưng', 10.000, 'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/470159813_122097395126660943_7022793989104890694_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_ohc=MBIsIWFk1CYQ7kNvgG8VMyX&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AH42nbiNj-CUApUaU25i31G&oh=00_AYDvDpJmnkiNxAPWPy2K7BxXayc7qM03LaGRTCXFKhLuZw&oe=6762DA7C', 1, '2024-12-14 04:45:31'),
(6, 1, 'Bún đậu', 'Bún đậu mắm tôm đầy đủ', 15.000, 'https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/470183710_122097395180660943_1407003487478193665_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=jFegE7LwsB8Q7kNvgEcPEvK&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=AUrR9NqB6xWnryHRetImFt6&oh=00_AYDo5n92LHuGm8oyUTO5wrBK68nBXX5-57v_x4HUSEMkDQ&oe=6762E70C', 1, '2024-12-14 04:45:31'),
(7, 1, 'Bánh cuốn nóng', 'Bánh cuốn nóng nhân thịt', 12.000, 'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/470186015_122097395066660943_8158675139027273568_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=FCr-LL7DOUMQ7kNvgF2N-wz&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AVGmQIFhCYUCV18PsrD81w_&oh=00_AYDEuHH83hct379mY-_yl5kagaaPsPj0PYWihf6IGpwcQg&oe=6762CBE5', 1, '2024-12-14 04:45:31'),
(8, 1, 'Mì quảng', 'Mì Quảng đặc sản miền Trung', 14.000, 'https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/470181294_122097395372660943_739976327725751104_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Sv8uo026S-UQ7kNvgHSmar7&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=AD5SEpz1k-RBAbopBCEUvBh&oh=00_AYC8fZ9kuhq0AGwz0wRgJWEwLbDv-AOSoH0KHtJLNSIqIQ&oe=6762CB78', 1, '2024-12-14 04:45:31'),
(9, 1, 'Bún chả', 'Bún chả Hà Nội', 10.000, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/470218179_122097395090660943_715585315901448055_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=1PSVLTeVyAkQ7kNvgGZVRvB&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=Ay9RPx0kMmN_sr3LwWASrd3&oh=00_AYDfxeZH-f5kPJ3ZuMJRFhJ43ns7NDi1Eo3XsymiA_rwTg&oe=6762F684', 1, '2024-12-14 04:45:31'),
(10, 2, 'Cơm tấm', 'Cơm tấm sườn bì chả', 15.000, 'https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/470230418_122097395240660943_5811830361814724942_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=12C6THyNP10Q7kNvgHQIjVn&_nc_zt=23&_nc_ht=scontent.fhan2-5.fna&_nc_gid=ARgt_f97Iid5qiebNQiIZmt&oh=00_AYA4lNONZ2fuCz9YgTo-snE3VjvQMaMJxxrX9xdztqaqXw&oe=6762D243', 1, '2024-12-14 04:45:31'),
(11, 2, 'Cơm gà xối mỡ', 'Cơm gà xối mỡ giòn rụm', 17.000, 'https://scontent.fhan20-1.fna.fbcdn.net/v/t39.30808-6/470181315_122097410042660943_377140919348690356_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=81hzJhuGmjAQ7kNvgFmjEE3&_nc_zt=23&_nc_ht=scontent.fhan20-1.fna&_nc_gid=ATIpKbBB6DNtrbJkHDYYuIM&oh=00_AYAsgOXBtd71Y4znNw2fqhocRJer9OtAXqY2dzLJF-iOhg&oe=6762F266', 1, '2024-12-14 04:45:31');

-- --------------------------------------------------------

--
-- Table structure for table `Tables`
--

CREATE TABLE `Tables` (
  `table_id` int NOT NULL,
  `table_number` varchar(10) NOT NULL,
  `capacity` int NOT NULL,
  `status` enum('available','occupied','reserved') DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Tables`
--

INSERT INTO `Tables` (`table_id`, `table_number`, `capacity`, `status`) VALUES
(1, 'A1', 4, 'available'),
(3, 'A2', 8, 'occupied'),
(4, 'hbtgvfd', 23, 'available'),
(5, 'A3', 4, 'available');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `role` enum('staff','admin') DEFAULT 'staff'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`user_id`, `username`, `password`, `full_name`, `email`, `phone`, `role`) VALUES
(2, 'admin', '$2a$10$5.sFjbLBEAS3H4e3/Jt3Y.eDKTdK6JnVy039qki0h.tpDO4TNLdvW', 'Admin', 'admin@example.com', '1234567890', 'admin'),
(3, 'sddd', '$2a$10$v4QT9msz9dj8nf86ilmRYeLYpA/QzHYKtK1pvOtnxOXp3HKmBw69u', 'sssssss', 'tranthibinh6626@gmail.com', '09876543', 'staff');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Categories`
--
ALTER TABLE `Categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `OrderDetails`
--
ALTER TABLE `OrderDetails`
  ADD PRIMARY KEY (`order_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `table_id` (`table_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `Tables`
--
ALTER TABLE `Tables`
  ADD PRIMARY KEY (`table_id`),
  ADD UNIQUE KEY `table_number` (`table_number`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Categories`
--
ALTER TABLE `Categories`
  MODIFY `category_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `Products`
--
ALTER TABLE `Products`
  MODIFY `product_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Tables`
--
ALTER TABLE `Tables`
  MODIFY `table_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `OrderDetails`
--
ALTER TABLE `OrderDetails`
  ADD CONSTRAINT `OrderDetails_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `Orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `OrderDetails_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Products` (`product_id`);

--
-- Constraints for table `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`table_id`) REFERENCES `Tables` (`table_id`),
  ADD CONSTRAINT `Orders_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `Users` (`user_id`);

--
-- Constraints for table `Products`
--
ALTER TABLE `Products`
  ADD CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
