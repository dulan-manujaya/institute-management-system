-- Host: localhost    Database: educa
-- ------------------------------------------------------
-- Server version	8.0.23-0ubuntu0.20.04.1
--
-- Table structure for table `assignments`
--
DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments` (
    `assignment_id` int NOT NULL AUTO_INCREMENT,
    `course_id` int NOT NULL,
    `title` varchar(100) NOT NULL,
    `paper_url` varchar(100) NOT NULL,
    `submitted_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deadline` datetime NOT NULL,
    PRIMARY KEY (`assignment_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `courses`
--
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
    `course_id` int NOT NULL AUTO_INCREMENT,
    `grade_id` int NOT NULL,
    `teacher_id` int NOT NULL,
    `amount` float NOT NULL,
    `course_name` varchar(100) NOT NULL,
    `subject_id` int NOT NULL,
    PRIMARY KEY (`course_id`),
    UNIQUE KEY `course_name_UNIQUE` (`course_name`),
    UNIQUE KEY `UK` (`teacher_id`, `subject_id`, `grade_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 32 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `enrollments`
--
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments` (
    `enrollment_id` int NOT NULL AUTO_INCREMENT,
    `course_id` int NOT NULL,
    `student_id` int NOT NULL,
    `enrolled_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `is_accepted` tinyint(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (`enrollment_id`),
    UNIQUE KEY `df` (`student_id`, `course_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `exam_results`
--
DROP TABLE IF EXISTS `exam_results`;
CREATE TABLE `exam_results` (
    `exam_results_id` int NOT NULL AUTO_INCREMENT,
    `exam_id` int NOT NULL,
    `student_id` int NOT NULL,
    `marks` int NOT NULL,
    PRIMARY KEY (`exam_results_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `exams`
--
DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams` (
    `exam_id` int NOT NULL AUTO_INCREMENT,
    `course_id` int NOT NULL,
    `exam_date` datetime NOT NULL,
    `exam_duration` int NOT NULL,
    `paper_url` varchar(100) NOT NULL,
    PRIMARY KEY (`exam_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `grade`
--
DROP TABLE IF EXISTS `grade`;
CREATE TABLE `grade` (
    `grade_id` int NOT NULL AUTO_INCREMENT,
    `grade_name` varchar(50) NOT NULL,
    PRIMARY KEY (`grade_id`),
    UNIQUE KEY `grade_name_UNIQUE` (`grade_name`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `months`
--
DROP TABLE IF EXISTS `months`;
CREATE TABLE `months` (
    `month_id` int NOT NULL DEFAULT '0',
    `month_name` varchar(45) NOT NULL,
    PRIMARY KEY (`month_id`),
    UNIQUE KEY `month_id_UNIQUE` (`month_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `payments`
--
DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
    `payment_id` int NOT NULL AUTO_INCREMENT,
    `enrollment_id` int NOT NULL,
    `paid_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `paid_for_month` int NOT NULL,
    `paid_for_year` int NOT NULL,
    PRIMARY KEY (`payment_id`),
    UNIQUE KEY `UK` (`enrollment_id`, `paid_for_month`, `paid_for_year`)
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `student`
--
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
    `student_id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(100) NOT NULL,
    `password` char(60) NOT NULL,
    `first_name` varchar(50) NOT NULL,
    `last_name` varchar(50) NOT NULL,
    `avatar` varchar(100) NOT NULL,
    `mobile` varchar(50) NOT NULL,
    `grade_id` int DEFAULT '0',
    `gender` varchar(45) NOT NULL DEFAULT 'Male',
    `date_of_birth` date NOT NULL,
    `initial_login` tinyint(1) NOT NULL DEFAULT '0',
    `registered_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`student_id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `mobile` (`mobile`)
) ENGINE = InnoDB AUTO_INCREMENT = 33 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `subjects`
--
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
    `subject_id` int NOT NULL AUTO_INCREMENT,
    `subject_name` varchar(100) NOT NULL,
    PRIMARY KEY (`subject_id`),
    UNIQUE KEY `subject_name` (`subject_name`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `submissions`
--
DROP TABLE IF EXISTS `submissions`;
CREATE TABLE `submissions` (
    `submission_id` int NOT NULL AUTO_INCREMENT,
    `assignment_id` int NOT NULL,
    `student_id` int NOT NULL,
    `assignment_url` varchar(100) NOT NULL,
    `submitted_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`submission_id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
--
-- Table structure for table `teacher`
--
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
    `teacher_id` int NOT NULL AUTO_INCREMENT,
    `email` varchar(100) NOT NULL,
    `password` char(60) NOT NULL,
    `first_name` varchar(50) NOT NULL,
    `last_name` varchar(50) NOT NULL,
    `nic` varchar(20) NOT NULL,
    `avatar` varchar(100) NOT NULL,
    `mobile` varchar(50) NOT NULL,
    PRIMARY KEY (`teacher_id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `nic` (`nic`),
    UNIQUE KEY `mobile` (`mobile`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;