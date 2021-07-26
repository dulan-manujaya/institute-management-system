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
-- Table structure for table `guardian`
--

DROP TABLE IF EXISTS `guardian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guardian` (
  `guardian_id` int NOT NULL AUTO_INCREMENT,
  `guardian_email` varchar(100) NOT NULL,
  `guardian_password` varchar(100) NOT NULL,
  `guardian_mobile` varchar(45) NOT NULL,
  `registered_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `initial_login` tinyint DEFAULT '1',
  PRIMARY KEY (`guardian_id`),
  UNIQUE KEY `email_UNIQUE` (`guardian_email`),
  UNIQUE KEY `mobile_UNIQUE` (`guardian_mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardian`
--

LOCK TABLES `guardian` WRITE;
/*!40000 ALTER TABLE `guardian` DISABLE KEYS */;
INSERT INTO `guardian` VALUES (32,'chamini@gmail.com','$2a$08$T8jxN628LdiPSr.4V8l0VeYwGwdy28Yj4tGxh9Kach3iJZtrv6NqC','0998887778','2021-06-16 20:53:14',1),(35,'thuduwewaththa@gmail.com','$2a$08$EuEAxfc7yNBRldSOkFXd7OMbRuIK7W.PFPuLpQinOhhPHtgMVFIpO','0772256354','2021-06-30 10:27:00',1),(36,'sisirakodithuwakku@gmail.com','$2a$08$ElM9Aq9VnYQJWVALPNumuu9j1zMkVcmeKCjem2P2NVef21zmLTCKG','0777777764','2021-07-01 15:36:52',1),(37,'bandara@gmail.com','$2a$08$HmQW2gxpbFGx/r.2fkWd..UeAfnYzkxN4UItDvIrUfzLkn65HFSQi','0777778765','2021-07-01 16:01:53',1),(38,'meth@gmail.com','$2a$08$Ow9.p/w3VxKiv/MBFEzHF.hG36t7DukLGlldyXJl44A3x5BPpPIHq','0772223443','2021-07-01 16:12:56',1),(40,'siriwar@gmail.com','$2a$08$8UOT4g.dcTX9FIKFYRszsOhYe6WwQqhxHVEEBf/3yCM3vbJgy89s2','0776545676','2021-07-15 18:47:27',1),(41,'raja@gmail.com','$2a$08$ZmeT02iXsOs807/3MSyuD.1RGql.iWJsrm.d4vDD.EbV/BngDoR7m','0776665554','2021-07-15 21:26:19',1);
/*!40000 ALTER TABLE `guardian` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-21 21:45:20
