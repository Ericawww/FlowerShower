/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 80017
Source Host           : localhost:3306
Source Database       : unitsys

Target Server Type    : MYSQL
Target Server Version : 80017
File Encoding         : 65001

Date: 2019-11-30 16:40:26
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for assistant
-- ----------------------------
DROP TABLE IF EXISTS `assistant`;
CREATE TABLE `assistant` (
  `userID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `classID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `priviledge` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userID`,`classID`),
  KEY `classID` (`classID`),
  CONSTRAINT `assistant_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assistant_ibfk_2` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of assistant
-- ----------------------------

-- ----------------------------
-- Table structure for chapter
-- ----------------------------
DROP TABLE IF EXISTS `chapter`;
CREATE TABLE `chapter` (
  `chapterID` int(11) NOT NULL AUTO_INCREMENT,
  `chapterNumber` int(3) NOT NULL,
  `title` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `content` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `classID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`chapterID`),
  KEY `classID` (`classID`),
  CONSTRAINT `chapter_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of chapter
-- ----------------------------

-- ----------------------------
-- Table structure for class
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `classID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `teacherID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `courseNumber` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `startTime` date NOT NULL,
  `closeTime` date NOT NULL,
  PRIMARY KEY (`classID`),
  KEY `teacherID` (`teacherID`),
  KEY `courseNumber` (`courseNumber`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_ibfk_2` FOREIGN KEY (`courseNumber`) REFERENCES `course` (`courseNumber`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class
-- ----------------------------

-- ----------------------------
-- Table structure for class_group
-- ----------------------------
DROP TABLE IF EXISTS `class_group`;
CREATE TABLE `class_group` (
  `groupID` int(11) NOT NULL AUTO_INCREMENT,
  `classID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `groupNumber` int(11) NOT NULL,
  `groupLeaderID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`groupID`),
  KEY `classID` (`classID`),
  KEY `groupLeaderID` (`groupLeaderID`),
  CONSTRAINT `class_group_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_group_ibfk_2` FOREIGN KEY (`groupLeaderID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class_group
-- ----------------------------

-- ----------------------------
-- Table structure for class_group_member
-- ----------------------------
DROP TABLE IF EXISTS `class_group_member`;
CREATE TABLE `class_group_member` (
  `groupID` int(11) NOT NULL,
  `studentID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  KEY `groupID` (`groupID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `class_group_member_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `class_group` (`groupID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_group_member_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class_group_member
-- ----------------------------

-- ----------------------------
-- Table structure for class_materials
-- ----------------------------
DROP TABLE IF EXISTS `class_materials`;
CREATE TABLE `class_materials` (
  `chapterID` int(11) NOT NULL,
  `path` varchar(256) COLLATE utf8mb4_general_ci NOT NULL,
  `submitter` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `uploadTime` datetime NOT NULL,
  KEY `submitter` (`submitter`),
  KEY `chapterID` (`chapterID`),
  CONSTRAINT `class_materials_ibfk_1` FOREIGN KEY (`submitter`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_materials_ibfk_2` FOREIGN KEY (`chapterID`) REFERENCES `chapter` (`chapterID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class_materials
-- ----------------------------

-- ----------------------------
-- Table structure for class_project
-- ----------------------------
DROP TABLE IF EXISTS `class_project`;
CREATE TABLE `class_project` (
  `classProjectID` int(11) NOT NULL AUTO_INCREMENT,
  `projectName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `classID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fullMark` int(11) DEFAULT '0',
  `startTime` datetime DEFAULT NULL,
  `closeTime` datetime DEFAULT NULL,
  `isGroupWork` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`classProjectID`),
  KEY `classID` (`classID`),
  CONSTRAINT `class_project_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class_project
-- ----------------------------

-- ----------------------------
-- Table structure for class_project_score
-- ----------------------------
DROP TABLE IF EXISTS `class_project_score`;
CREATE TABLE `class_project_score` (
  `classProjectID` int(11) NOT NULL,
  `studentID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `mark` int(11) DEFAULT '0',
  `comment` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`classProjectID`,`studentID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `class_project_score_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_project_score_ibfk_2` FOREIGN KEY (`classProjectID`) REFERENCES `class_project` (`classProjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class_project_score
-- ----------------------------

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `courseNumber` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `courseName` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `courseEnglishName` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `courseDept` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `credit` decimal(1,1) NOT NULL,
  `prerequisite` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `outline` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`courseNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of course
-- ----------------------------

-- ----------------------------
-- Table structure for msgboard
-- ----------------------------
DROP TABLE IF EXISTS `msgboard`;
CREATE TABLE `msgboard` (
  `msgId` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(512) COLLATE utf8mb4_general_ci NOT NULL,
  `contact` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`msgId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of msgboard
-- ----------------------------
INSERT INTO `msgboard` VALUES ('1', '哈哈哈哈哈', '123');
INSERT INTO `msgboard` VALUES ('2', 'hhhh', '123');

-- ----------------------------
-- Table structure for take
-- ----------------------------
DROP TABLE IF EXISTS `take`;
CREATE TABLE `take` (
  `studentID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `classID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  KEY `classID` (`classID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `take_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `take_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of take
-- ----------------------------

-- ----------------------------
-- Table structure for teacher_info
-- ----------------------------
DROP TABLE IF EXISTS `teacher_info`;
CREATE TABLE `teacher_info` (
  `teacherID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `position` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `patent` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `papers` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`teacherID`),
  CONSTRAINT `teacher_info_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of teacher_info
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `userName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `userPwd` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `phoneNumber` varchar(16) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `gender` int(1) DEFAULT NULL,
  `userType` int(1) NOT NULL DEFAULT '0',
  `userPhoto` varchar(128) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userIntro` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1111', '应承峻', '123', '3170103456@zju.edu.cn', '17326084929', '1999-06-22', '1', '0', 'photos/1574833836929.jpeg', 'HTT是憨批');
