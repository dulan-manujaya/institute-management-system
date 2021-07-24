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
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` char(60) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `avatar` varchar(100) NOT NULL,
  `mobile` varchar(50) NOT NULL,
  `gender` varchar(45) NOT NULL DEFAULT 'Male',
  `date_of_birth` date NOT NULL,
  `registered_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `guardian_id` int NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `mobile` (`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (116,'chamath@gmail.com','$2a$08$u1unyPGUNBl8g3Rol2Yhge1E5qJevXIq3kNoa3dhvWo59SuBQAQna','Chamath','Kodithuwakku','male-avatar.png','0992223335','Male','2014-05-12','2021-06-16 21:26:47',32),(117,'sanduni@gmail.com','$2a$08$7jLwa61ggBNPFXXWEzIpG.y9P.EPXTgg9x7Eo3nDBy1.jTR4xyXee','Sanduni','Thuduwewaththa','male-avatar.png','0779563349','Female','1997-11-13','2021-06-30 10:27:01',35),(118,'hirumikodithuwakku97@gmail.com','$2a$08$cgRZtXY0iFDM2ndJOF960OEq.O4vsIYQToJTBay5KKEc.OnjlXCEi','Hirumi','Kodithuwakku','http://localhost:4000/public/student-avatars/female-avatar.png','0774158636','Female','1997-06-01','2021-07-01 15:36:52',36),(119,'nethuli@gmail.com','$2a$08$0pseJ2r03OYCs31xoJLeb.MtQITSc8qWHHp8VsX2H58BB3pta45Tu','Nethuli','Bandara','male-avatar.png','0773345434','Female','1996-02-06','2021-07-01 16:01:55',37),(120,'senuki@gmail.com','$2a$08$0SY8ov4cGv3KP1EASIMtD.Aw1uMG989p8XxotLRbHpYw0iSlwhBwG','Senuki','Methsara','http://localhost:4000/public/student-avatars/female-avatar.png','0774433445','Female','2006-02-01','2021-07-01 16:12:56',38),(121,'akitha@gmail.com','$2a$08$58vxlGlwNlrAP9FDCY7hCuXs8uMPJDnf5DHtvZwOHUhIGgibSXXMO','Akitha ','Bandara','male-avatar.png','0774436667','Male','2003-03-06','2021-07-11 15:46:18',37),(122,'vinu@gmail.com','$2a$08$FoKM8wvMxsiMCKfKvJhAH.pbryQSjIfZ5I2Vsn.dEDysQugxrc.C6','Vinu','Siriwardhana','male-avatar.png','0778766775','Female','1998-03-18','2021-07-15 18:47:27',40),(123,'nayomi@gmail.com','$2a$08$b/4WJLqR0eaCtc7Si6tOyugK34a6xE1I9oVN/oZqeTs3bbI3un4sK','Nayomi','Rajapaksha','http://localhost:4000/public/student-avatars/female-avatar.png','0776788767','Female','2009-03-18','2021-07-15 21:26:19',41);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-21 21:45:23
