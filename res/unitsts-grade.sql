/*

Source Server         : localhost
Source Server Version : 80017
Source Host           : localhost:3306
Source Database       : unitsys

*/

CREATE TABLE `class_grade` (
    `classID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
    `studentID` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
    `userName` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
    `usualGrade` int(11) DEFAULT '0',
    `homeworkGrade` int(11) DEFAULT '0',
    `testGrade` int(11) DEFAULT '0',
    KEY `classID` (`classID`),
    KEY `studentID` (`studentID`)
    -- CONSTRAINT `take_ibfk_3` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
    -- CONSTRAINT `take_ibfk_4` FOREIGN KEY (`studentID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `class_grade` VALUES ('000001', '3170100001', '小红', '100', '100', '100');
INSERT INTO `class_grade` VALUES ('000001', '3170100002', '小明', '60', '60', '60');
INSERT INTO `class_grade` VALUES ('000001', '3170100003', '小绿', '20', '20', '20');
