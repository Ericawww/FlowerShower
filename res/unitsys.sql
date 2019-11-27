/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 80017
Source Host           : localhost:3306
Source Database       : unitsys

Target Server Type    : MYSQL
Target Server Version : 80017
File Encoding         : 65001

Date: 2019-11-27 14:18:14
*/

SET FOREIGN_KEY_CHECKS=0;

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
