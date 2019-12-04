/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80018
 Source Host           : localhost
 Source Database       : unitsys

 Target Server Type    : MySQL
 Target Server Version : 80018
 File Encoding         : utf-8

 Date: 12/02/2019 21:34:48 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `talk`
-- ----------------------------
DROP TABLE IF EXISTS `talk`;
CREATE TABLE `talk` (
  `talkID` varchar(32) NOT NULL,
  `courseID` varchar(32) NOT NULL,
  `title` varchar(64) NOT NULL,
  `content` varchar(512) NOT NULL,
  `time` timestamp(6) NOT NULL,
  PRIMARY KEY (`talkID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
--  Records of `talk`
-- ----------------------------
BEGIN;
INSERT INTO `talk` VALUES ('0', '1', '我爱学习', '我爱写代码', '2019-12-02 21:34:34.000000');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
