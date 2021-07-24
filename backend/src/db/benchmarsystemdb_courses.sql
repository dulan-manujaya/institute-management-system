-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: benchmarsystemdb
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `teacher_id` int NOT NULL,
  `amount` float NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `description` varchar(3000) DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `course_name_UNIQUE` (`course_name`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (49,9,30000,'Business Management - Level 1','Course Content:\n 1.Introduction to Business and Organization Structure.\n 2.Management Process.\n 3.Recording Financial Transaction.\n 4.Fundamentals of Marketing Management.'),(50,9,40000,'Business Management- Level 2','Course Content: 1.Financial Accounting 2.Economics of Business Enterprise 3.Business Communication 4.Management Accounting 5.Operations Management\n'),(52,9,45000,'Business Management- Level 3','Course Content: 1.Business in a Global Context 2.Marketing Management 3.Human Resource Management 4.Fundamentals of Financial Accounting 5.Business Finance 6.Information for Management.'),(53,9,5000,'Business English','The Business English course is designed for those who are interested in improving their competence in the English language in order to be more successful in a business environment.\nLearning outcomes-  \nEffective communication for business.\nNegotiation skills.'),(63,9,30000,'Spoken English','Spoken English courses will help you improve all aspects of oral communication.\nLearning outcomes - Learn to speak more confidently, Practice listening more attentively, \nLearn phrases that help with your fluency.\n\n'),(66,10,30000,'Information Technology - Level 1','Course Content: 1.Introduction to Computer Science 2.Number Systems and Computer Arithmetic 3.System Software 4.Computer Programming.'),(67,10,40000,'Information Technology - Level 2','Course Content: 1.Fundamentals of software and software engineering 2.Computer Architecture and Hardware 3.Web Design and Development 4.Computer Programming Level II 5.Database Design and Development 6.Object-oriented Programming.'),(68,10,50000,'Information Technology - Level 3','Course Content: 1.Project Management 2.Software maintenance 3.Web Application Development 4.Mobile Application Development 5. Research Project.');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-21 21:45:26
