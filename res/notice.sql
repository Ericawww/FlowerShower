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

 Date: 11/30/2019 23:12:31 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `notice`
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `noticeID` int(11) NOT NULL AUTO_INCREMENT,
  `courseID` int(11) NOT NULL,
  `time` timestamp(6) NOT NULL,
  `content` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`noticeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
--  Records of `notice`
-- ----------------------------
BEGIN;
INSERT INTO `notice` VALUES ('1', '1', '2019-11-30 22:21:41.000000', 'hahahaha'), ('2', '1', '2019-11-30 22:11:08.000000', '123'), ('3', '1', '2019-11-30 22:23:33.000000', 'boring');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
