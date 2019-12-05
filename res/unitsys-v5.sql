/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 80017
Source Host           : localhost:3306
Source Database       : unitsys

Target Server Type    : MYSQL
Target Server Version : 80017
File Encoding         : 65001

Date: 2019-12-05 19:07:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for assistant
-- ----------------------------
DROP TABLE IF EXISTS `assistant`;
CREATE TABLE `assistant` (
  `userID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `classID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `privilege` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userID`,`classID`),
  KEY `classID` (`classID`),
  CONSTRAINT `assistant_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assistant_ibfk_2` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of assistant
-- ----------------------------
INSERT INTO `assistant` VALUES ('AS0001', 'Class01', '7');

-- ----------------------------
-- Table structure for chapter
-- ----------------------------
DROP TABLE IF EXISTS `chapter`;
CREATE TABLE `chapter` (
  `chapterID` int(11) NOT NULL AUTO_INCREMENT,
  `chapterNumber` int(3) NOT NULL,
  `title` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `classID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
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
  `classID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `teacherID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `courseNumber` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `startTime` date NOT NULL,
  `closeTime` date NOT NULL,
  `projectWeight` int(3) NOT NULL DEFAULT '100',
  `examWeight` int(3) NOT NULL DEFAULT '0',
  `usualWeight` int(3) NOT NULL DEFAULT '0',
  `quizWeight` int(3) NOT NULL DEFAULT '0',
  PRIMARY KEY (`classID`),
  KEY `teacherID` (`teacherID`),
  KEY `courseNumber` (`courseNumber`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`teacherID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_ibfk_2` FOREIGN KEY (`courseNumber`) REFERENCES `course` (`courseNumber`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class
-- ----------------------------
INSERT INTO `class` VALUES ('Class01', 'T0001', '031E0031', '1999-04-30', '2019-12-03', '100', '0', '0', '0');
INSERT INTO `class` VALUES ('Class02', 'T0001', '21191910', '2019-12-04', '2019-12-04', '100', '0', '0', '0');
INSERT INTO `class` VALUES ('Class03', 'T0002', '031E0031', '2019-12-04', '2019-12-04', '100', '0', '0', '0');

-- ----------------------------
-- Table structure for class_group
-- ----------------------------
DROP TABLE IF EXISTS `class_group`;
CREATE TABLE `class_group` (
  `groupID` int(11) NOT NULL AUTO_INCREMENT,
  `classID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `groupNumber` int(11) NOT NULL,
  `groupLeaderID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`groupID`),
  UNIQUE KEY `classID_2` (`classID`,`groupNumber`),
  UNIQUE KEY `classID_3` (`classID`,`groupLeaderID`),
  KEY `classID` (`classID`),
  KEY `groupLeaderID` (`groupLeaderID`),
  CONSTRAINT `class_group_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_group_ibfk_2` FOREIGN KEY (`groupLeaderID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class_group
-- ----------------------------
INSERT INTO `class_group` VALUES ('1', 'Class01', '1', '1111');
INSERT INTO `class_group` VALUES ('2', 'Class01', '2', '2222');
INSERT INTO `class_group` VALUES ('3', 'Class03', '1', '3333');

-- ----------------------------
-- Table structure for class_group_member
-- ----------------------------
DROP TABLE IF EXISTS `class_group_member`;
CREATE TABLE `class_group_member` (
  `groupID` int(11) NOT NULL,
  `studentID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  UNIQUE KEY `groupID_2` (`groupID`,`studentID`),
  KEY `groupID` (`groupID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `class_group_member_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `class_group` (`groupID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_group_member_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class_group_member
-- ----------------------------
INSERT INTO `class_group_member` VALUES ('1', '4444');
INSERT INTO `class_group_member` VALUES ('1', '5555');
INSERT INTO `class_group_member` VALUES ('1', '6666');
INSERT INTO `class_group_member` VALUES ('1', '7777');
INSERT INTO `class_group_member` VALUES ('3', '2222');

-- ----------------------------
-- Table structure for class_materials
-- ----------------------------
DROP TABLE IF EXISTS `class_materials`;
CREATE TABLE `class_materials` (
  `chapterID` int(11) NOT NULL,
  `path` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `submitter` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
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
  `projectName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `classID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fullMark` int(11) DEFAULT '0',
  `startTime` datetime DEFAULT NULL,
  `closeTime` datetime DEFAULT NULL,
  `isGroupWork` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`classProjectID`),
  KEY `classID` (`classID`),
  CONSTRAINT `class_project_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class_project
-- ----------------------------
INSERT INTO `class_project` VALUES ('1', 'Class01-Lab1', 'Class01', null, '10', null, null, '0');
INSERT INTO `class_project` VALUES ('2', 'Class01-Lab2', 'Class01', null, '10', null, null, '0');
INSERT INTO `class_project` VALUES ('3', 'Class02-Lab1', 'Class02', null, '20', null, null, '0');
INSERT INTO `class_project` VALUES ('4', 'Class03-Lab1', 'Class03', null, '30', null, null, '0');

-- ----------------------------
-- Table structure for class_project_score
-- ----------------------------
DROP TABLE IF EXISTS `class_project_score`;
CREATE TABLE `class_project_score` (
  `classProjectID` int(11) NOT NULL,
  `studentID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `filePath` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `commitMsg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `commitTime` datetime DEFAULT NULL,
  `mark` int(11) DEFAULT '0',
  `markTime` datetime DEFAULT NULL,
  `comment` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `complainMsg` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`classProjectID`,`studentID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `class_project_score_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `class_project_score_ibfk_2` FOREIGN KEY (`classProjectID`) REFERENCES `class_project` (`classProjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of class_project_score
-- ----------------------------
INSERT INTO `class_project_score` VALUES ('1', '1111', null, null, null, '1', null, null, null);
INSERT INTO `class_project_score` VALUES ('1', '2222', null, null, null, '1', null, null, null);
INSERT INTO `class_project_score` VALUES ('2', '1111', null, null, null, '1', null, null, null);
INSERT INTO `class_project_score` VALUES ('2', '2222', null, null, null, '1', null, null, null);
INSERT INTO `class_project_score` VALUES ('3', '1111', null, null, null, '1', null, null, null);
INSERT INTO `class_project_score` VALUES ('4', '2222', null, null, null, '1', null, null, null);
INSERT INTO `class_project_score` VALUES ('4', '3333', null, null, null, '1', null, null, null);

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `commentID` int(32) NOT NULL AUTO_INCREMENT,
  `talkID` varchar(32) NOT NULL,
  `userID` varchar(32) NOT NULL,
  `content` varchar(512) NOT NULL,
  `time` timestamp(6) NOT NULL,
  PRIMARY KEY (`commentID`),
  KEY `talkID` (`talkID`),
  CONSTRAINT `comment2talk` FOREIGN KEY (`talkID`) REFERENCES `talk` (`talkID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of comment
-- ----------------------------

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `courseNumber` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `courseName` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `courseDept` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `credit` decimal(10,1) NOT NULL,
  `prerequisite` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `outline` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `coursePhoto` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`courseNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of course
-- ----------------------------
INSERT INTO `course` VALUES ('031E0031', '毛泽东思想和中国特色社会主义理论体系概论', '马克思主义学院', '4.0', '无', '本课程全面系统阐述马克思主义中国化的两大理论成果--毛泽东思想和中国特色社会主义理论体系，帮助学生掌握建设中国特色社会主义的总依据和总任务，了解中国特色社会主义改革开放的发展历程，掌握建设中国特色社会主义的总布局；同时，要全面了解中国特色社会主义的外交和国际战略，明确建设中国特色社会主义的根本目的和依靠力量，掌握建设中国特色社会主义的领导核心就是坚持共产党的领导，全面提高党的建设的科学化水平，全面从严治党。要帮助学生树立正确的世界观、人生观和价值观，学会运用马克思主义的世界观和方法论去认识和分析问题，坚持中国特色社会主义的道路自信、理论自信、制度自信和文化自信，不断把中国特色社会主义推向前进。', '二、教学目标\n(一)学习目标\n通过《毛泽东思想和中国特色社会主义理论体系概论》课程的学习，要求学生了解马克思主义中国化的历史进程，掌握中国特色社会主义理论体系的主要内容及其重要的历史地位和意义。要求学生掌握并深刻理解社会主义的本质和根本目的，了解中国的基本国情并充分理解社会主义初级阶段的长期性，掌握社会主义主义初级阶段的基本路线和基本纲领，掌握社会主义初级阶段的发展战略。\n通过该课程的学习，要求学生掌握中国特色社会主义的总体布局，即中国特色社会主义政治、经济、文化、社会和生态建设五位一体的主要内容、历史地位。要求学生了解中国对台政策的演变，掌握和平统一、一国两制科学构想的主要内容及成功实践。要求学生了解国际形势的发展与演变，掌握独立自主和平外交政策的基本内容。掌握中国特色社会主义事业的各种依靠力量，掌握新时期爱国统一战线的内容和基本任务，了解国防和军队现代化建设的基本内容。深刻理解党的领导是社会主义现代化建设的根本保证，坚持党的领导必须改善党的领导的迫切性和重要性。\n通过本课程的学习，要求学生清晰掌握中国特色社会主义道路、理论体系和制度的基本内涵及相互关系，用社会主义核心价值体系武装他们的大脑，帮助他们树立正确的价值观和人生观，增强他们执行党的基本路线和基本纲领的自觉性和坚定性，为全面建成小康社会和实现社会主义现代化做出自己应有的贡献。\n（二）可测量结果\n⑴准确掌握本课程各章节的基本概念及其相关理论；\n⑵全面准确了解历史事件的发展脉络，掌握各章节的重点；\n⑶培养运用马克思主义的世界观和方法论判断及分析现实中的具体问题的能力；\n三、课程要求\n（一）授课方式与要求\n    多媒体课堂讲授+实践教学，部分课堂拟采用大班授课+小班讨论方式，采用专题讲座。\n要求任课教师采用PPT，讲课方式可以灵活多样，加强教师与学生的互动性，采用多形式的课堂讨论，提高学生的参与度。\n部分课堂采用专题讲座方式，增加小班讨论的次数。\n实践教学环节以中国特色社会主义在浙江的案例为主题，要求学生组队完成相应的案例收集及写作任务，优秀教学案例整理汇编。\n（二）    考试评分与建议\n    课堂表现+考勤：20分，社会实践：20分，期末考试：40分。\n四、教学安排\n本课程主要阐述马克思主义基本原理与中国实际相结合产生的重大理论成果：毛泽东思想、邓小平理论、三个代表重要思想和科学发展观，从社会主义建设的道路选择和主要内容出发，把这些理论成果的内容交织融合起来，作为一脉相承的科学体系加以说明。主要教学内容包括十五章。\n第一章 马克思主义中国化的历史进程及其理论成果\n1.教学目的和要求\n通过第一章的学习，要使学生对马克思主义中国化的科学内涵和历史进程有一个总体的了解；对马克思主义中国化的几具重大理论成果的时代背景、实践基础、科学体系、主要内容、历史地位和指导意义有一个基本的把握；对马克思主义中国化各个理论成果之间的内在关系有一个准确的认识。\n2.教学重点和难点\n（1）马克思主义中国化的认识过程\n（2）马克思主义中国化的思想实质\n（3）马克思主义中国化的预期目标\n（4）毛泽东思想、邓小平理论、三个代表重要思想形成的时代背景、实践基本、科学体系、主要内容、指导意义\n（5）科学发展观的形成、发展、科学体系、主要内容，指导意义\n3.教学内容\n第一节 马克思主义中国化的科学内涵及其历史进程\n第二节 毛泽东思想 \n第三节 邓小平理论\n第四节 三个代表重要思想 \n第五节 科学发展观\n第二章 马克思主义中国化理论成果的精髓 \n1.教学目的和要求\n本章主要是为了使学生了解和把握马克思主义中国化理论成果的精髓所在。马克思主义中国化理论成果的精髓就是实事思想。由于这个精髓又是中国共产党思想路线的核心，因而要了解马克思主义中国化理论成果的精髓，需要首先了解党的思想路线。\n2.教学重点和难点\n（1）实事求是思想路线的形成和发展\n（2）实事求是思想路线的基本内容和重要意义\n（3）马克思主义中国化理论成果的精髓\n（4）与时俱进和理论创新\n3.教学内容\n第一节 实事求是思想路线的形成和发展\n第二节 实事求是思想路线的内容和意义\n第三节 解放思想，实事求是，与时俱进\n第三章 新民主主义革命理论（略）\n第四章 社会主义改造理论（略）\n第五章 社会主义的本质和根本任务 \n1.教学目的和要求\n本章从毛泽东提出马克思主义同中国实际的第二次结合以及中国特色社会主义建设道路初步探索的理论成果开始，主要分析社会主义本质的理论。改革开放以来，邓小平反复强调要搞清楚什么是社会主义，怎样建设社会主义的问题。搞清楚什么是社会主义，一个重要的方面就是要搞清楚什么是社会主义的本质。通过本章的学习，帮助学生理解什么是社会主义的本质？它同通常说的社会主义的基本特征或本质特征有什么区别？什么样的理论和实践的背景要求提出社会主义本质的理论？这个理论怎样使我们对社会主义的认识提高到了一个新的科学水平？准确理解和把握社会主义本质理论，对于中国特色社会主义现代化建设事业具有重大的政治意义、理论意义和实践意义。\n2.教学重点和难点\n（1）正确认识改革开放以前党对中国特色社会主义建设道路的初步探索成果和认识的曲折发展\n（2）关于社会主义本质理论\n3.教学内容\n第一节 中国特色社会主义建设道路的初步探索 \n第二节 对社会主义本质的新认识 \n第三节 社会主义的根本任务\n第六章 社会主义初级阶段理论 \n1.教学目的和要求\n本章主要回答中国建立的社会主义处于社会主义发展的什么阶段。主要分析中国社会主义处于一个什么样的发展阶段；如何认识这一阶段国内的主要矛盾和根本任务，党应该采取什么样的路线方针和政策，制定什么样的发展战略。所有这些，都是改革开放前我们党进行探索但又未能很好解决的问题。中国之所以会发生文化大革命及其以前左的错误，一个重要的原因就是对我国社会主义发展阶段缺乏科学的、清醒的认识，制定的政策超越了社会主义的初级阶段。十一届三中全会以后，党对社会主义初级阶段基本国情有了科学的认识和准确把握，从整体上解决了我国社会主义发展的现实起点问题，构成了邓小平国情理论的基础。本章就是要说明应当怎样理解社会主义初级阶段的科学内涵，它同过渡时期的区别和联系；社会主义初级阶段应当制定什么样的基本路线、基本纲领和发展战略。\n2.教学重点和难点\n（1）为什么提出社会主义初级阶段理论\n（2）社会主义初级阶段的科学含义\n（3）社会主义初级阶段与过渡时期的区别\n（4）社会主义初级阶段的长期性\n（5）中国特色社会主义的奋斗目标\n（6）社会主义初级阶段的基本路线中两个基本点的辩证关系\n（7）关于现代化的发展战略\n3.教学内容\n第一节 社会主义初级阶段是我国最大的实际 \n第二节 社会主义初级阶段的基本路线和基本纲领 \n第三节 社会主义初级阶段的发展战略\n第七章 社会主义改革和对外开放\n1.教学目的和要求\n本章分析社会主义的改革和开放。改革开放是决定中国命运的重大决策，是新时期最鲜明的特征。改革开放理论是邓小平在科学认识什么是社会主义的基础上，进一步解决怎样建设社会主义的最主要方面。关于改革，主要讲清楚为什么要进行改革，即什么是改革的理论依据和实践基础，改革包括哪些主要内容，怎样正确改革的性质，改革对巩固和发展社会主义的重大意义。关于开放，主要是阐述为什么必须实行开放的政策，我们进行了怎样的开放，将如何进一步扩大开放。\n2.教学重点和难点\n（1）关于社会主义社会基本矛盾理论\n（2）关于改革的社会主义性质和方向\n（3）关于三个有利于标准\n（4）关于对外开放是中国的基本国策\n3.教学内容\n第一节 改革开放决定中国当代命运的关键抉择\n第二节 决定不移地推进全面改革\n第三节 毫不动摇地坚持对外开放\n第八章 建设中国特色社会主义经济 \n1.教学目的和要求\n本章分析建设中国特色社会主义经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>，包括经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>制度和体制、经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>发展的重大战略方针。本章首先应当帮助学生认识中国选择社会主义市场经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>体制的理论和实践基础，选择的历史过程和社会主义市场经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>体制的性质和内容，指出它是改革开放实践发展的必然结果，也是长期理论探索的重大成果。社会主义市场经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>发展使我国所有制结构和分配制度发生了深刻变化。所以应当进一步了解党对我国社会主义初级阶段基本经济制度和分配制度的新概括，强调应当全面理解公有制和按需分配的含义及其主体地位，坚持主体地位的重要意义。搞清楚如何正确认识和处理公有制经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>和非公有制经济、按需分配和按生产要素分配的关系；如何保持我国国民经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>又快又好地发展。搞清这些问题，有助于深刻理解和掌握中国特色社会主义经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>的基本理论，不断推进中国特色社会主义经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>建设。\n2.教学重点和难点\n（1）关于社会主义市场经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>理论\n（2）关于社会主义初级阶段基本经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>制度问题\n（3）关于社会主义初级阶段的分配制度\n（4）关于推动经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>又快又好发展\n3.教学内容：\n第一节 建立社会主义市场经济体制 \n第二节 社会主义初级阶段的基本经济制度 \n第三节 社会主义初级阶段的分配制度 \n第四节 推动国民经济又好又快发展\n第九章 建设中国特色社会主义政治 \n1.教学目的和要求\n本章主要阐述建设中国特色社会主义政治中的有关问题，回答中国特色社会主义民主政治制度、社会主义法治国家同西方国家的政治制度、法治的联系和本质区别。让学生了解：为什么我们必须坚持中国特色社会主义的基本政治制度？为什么不能照搬西方议会民主、三权分立和多党制？为什么要积极稳步推进政治体制改革，建设政治文明和法治国家进程中吸取人类文明成果时，必须分清马克思主义和西方理论在国家和法的理论上的根本区别，坚持马克思主义的指导地位。\n2.教学重点和难点\n（1）为什么说人民民主专政是具有中国特色无产阶级专政;为什么在当前还必须强调坚持无产阶级专政\n（2）我们为什么不能照搬西方的三权分方制度\n（3）为什么必须坚持共产党领导的多党合作和政治协商制度？为什么不能照搬西方的多党制\n（4）如何认识社会主义社会的民主、自由和人权\n3.教学内容：\n第一节 中国特色社会主义的民主政治\n第二节 依法治国，建设社会主义法治国家 \n第三节 推进政治体制改革，发展民主政治\n第十章 建设中国特色社会主义文化\n1.教学目的和要求\n本章主要阐述代表中国先进文化的前进方向，建设中国特色社会主义文化的战略地位、根本任务和指导方针，解读党的十六届六中全会提出的建设社会主义核心价值体系的主要内容，阐释加强思想道德建设与教育科学文化建设的主要内容和方针政策，帮助学生了解中国特色社会主义文化建设、社会主义核心价值体系建设、思想道德建设和教育文化建设的重要性、主要内容和基本方针政策。\n2.教学重点和难点\n（1）文化、精神文明、先进文化、和谐文化、中国特色社会主义文化的关系\n（2）发展中国特色社会主义文化的重要意义\n（3）关于建设和谐文化\n（4）关于建设社会主义核心价值体系\n（5）关于坚持马克思主义在意识形态领域的指导地位\n3.教学内容\n第一节 发展社会主义先进文化\n第二节 建设社会主义核心价值体系 \n第三节 加强思想道德建设和教育科学文化建设\n第十一章 构建社会主义和谐社会 \n1.教学目的和要求\n本章主要分析构建社会主义和谐社会的重要性和紧迫性，介绍我们党提出构建社会主义和谐社会的理论渊源和现实依据，论述构建社会主义和谐社会的指导思想、基本原则和目标任务，帮助学生深刻认识构建社会主义和谐社会的科学涵义和重要意义，了解关于构建社会主义和谐社会的主要方针政策。\n2.教学重点和难点\n（1）如何理解社会的含义\n（2）如何理解和谐的科学内涵\n（3）准确把握和谐社会的科学内涵\n（4）关于构建社会主义和谐社会提出的过程\n（5）为什么说社会和谐是中国特色社会主义的本质属性\n3.教学内容\n第一节 构建社会主义和谐社会的重要性和紧迫性 \n第二节 构建社会主义和谐社会的总体思路\n第十二章 祖国完全统一的构想\n1.教学目的和要求\n通过本章的教学，使学生认清实现祖国完全统一是中华民族的根本利益所在，学习我们党关于实现祖国统一的基本立场、战略策略和方针政策；了解我们党和人民对解决台湾问题的坚定信念和决心，把握建国50多年来我们党和政府对台方针政策经历了解放台湾到和平统一的两个重要历史过程；把握和平统一、一国两制构想的形成确立过程、基本内容和重要意义，了解一国两制科学构想在香港、澳门的成功实践及其对解决台湾问题的重大推动作用；了解解决台湾问题、实现祖国完全统一的极端重要性，学习掌握和平统一、一国两制构想在新形势下的坚持和发展。\n2.教学重点和难点\n（1）关于一国两制构想的基本内容\n（2）如何理解中国共产党实现祖国完全统一战略构想的一贯性和连续性\n（3）关于以江泽民为核心的第三代领导集体对和平统一、一国两制构想的丰富和发展\n（4）关于以胡锦涛为总书记的党中央对和平统一、一国两制构想的丰富和发展\n3.教学内容\n第一节 实现祖国完全统一是中华民族的根本利益 \n第二节 从武力解放台湾到和平解放台湾\n第三节 和平统一、一国两制的科学构想\n第四节 新形势下和平统一、一国两制构想的重要发展\n第十三章 国际战略和外交政策\n1.教学目的和要求\n通过本章教学使学生了解第二次世界大战后国际形势的发展变化及其基本特点，认清在经济 <http://www.hainnu.edu.cn/yuanxisz/shkxbu/so/?word=经济>全球化和世界多极化条件下和平与发展仍是当今时代的主题；掌握中国共产党在外交方面的基本原则、方针和政策；通过对中国在国际舞台上地位和作用提高的分析，明确中国坚持走和平发展道路，坚持反对霸权主义、维护世界和平的决心和信心。\n2.教学重点和难点\n（1）对战后国际形势和时代主题的认识\n（2）关于和平发展的道路\n（3）关于和谐世界\n3.教学内容\n第一节 国际形势的发展及特点 \n第二节 独立自主的和平外交政策\n第十四章 中国特色社会主义事业的依靠力量 \n1.教学目的和要求\n通过本章教学使学生了解中国共产党领导的革命、建设和改革是伟大的事业，完成这一事业，必须坚定地依靠中国最广大的人民群众，必须巩固和发展统一战线，必须加强人民军队建设和国防建设；帮助学生认清人民群众是历史的创造者，是推动社会变革的基本力量，没有广大群众的充分发动、参与和创造性的实践，任何社会变革都不会取得成功；进而帮助学生树立群众观点，掌握群众路线，把自己融入广大群众建设中国特色社会主义的伟大事业之中。\n2.教学重点和难点\n（1）中国特色社会主义依靠力量理论的提出及其意义\n（2）在新的历史条件下，如何正确理解工人阶级是我们国家的领导阶级\n（3）如何理解新的社会阶层也是中国特色社会主义事业的建设者\n（4）如何理解四个尊重是党和国家的一项重大方针\n（5）关于国防和军队现代化建设\n3.教学内容\n第一节 建设中国特色社会主义是全国各族人民的共同事业 \n第二节 巩固和发展爱国统一战线 \n第三节 加强国防和军队现代化建设\n第十五章 中国特色社会主义事业的领导核心 \n1.教学目的和要求\n通过本章教学使学生了解中国共产党是建设中国特色社会主义事业的领导核心；立党为公、执政为民，是党的根本宗旨的体现，是党始终恪守的政治立场；充分认识以加强党的执政能力建设和先进性建设为重点、全面推进党的建设新的伟大工程的实现途径和重大意\n2.教学重点和难点\n（1）如何理解中国共产党是工人阶级的先锋队，同时又是中国人民和中华民族的先锋队\n（2）如何理解中国共产党是社会主义现代化建设的领导核心\n3.教学内容\n第一节 党的领导是社会主义现代化建设的根本保证 \n第二节 坚持立党为公、执政为民 \n第三节 以改革创新精神全面推进党的建设新的伟大工程\n附：时间表\n周次    授课主题    备注    \n1    马克思主义中国化的历史进程和理论成果（讲授）    6课时    \n2    马克思主义中国化理论成果的精髓（讲授）    3课时    \n3    社会主义的本质和根本任务（讲授）    6课时    \n4    社会主义初级阶段理论（讲授）    6课时    \n5    国情问题讨论（讨论）    3课时    \n6    社会主义改革和对外开放（讲授）    6课时    \n7    建设中国特色社会主义经济（讲授）    8课时    \n8    非公有制经济的发展、收入分配问题（讨论）    3课时    \n9    建设中国特色社会主义政治（讲授）    6课时    \n10    建设中国特色社会主义文化（讲授）    3课时    \n11    构建社会主义和谐社会（讲授）    6课时    \n12    祖国完全统一的构想（讲授）    6课时    \n13    国际战略和外交政策（讲授）    6课时    \n14    中国特色社会主义事业的依靠力量（讨论）    6课时    \n15    中国特色社会主义事业的领导核心（讲授）    6课时    \n    合计    80    \n\n五、参考教材及相关资料\n《毛泽东思想和中国特色社会主义理论体系概论》，本书编写组编，高等教育出版社，2010年6月。\n1．《关于建国以来党的若干历史问题的决议》，见《三中全会以来重要文献选编》（上），人民出版社1982年版。\n2.《毛泽东选集》第1-4卷，人民出版社1991年版。\n3.《毛泽东文集》第6、7、8卷，人民出版社1999年版。\n4. 薄一波：《若干重大决策与事件的回顾》（上）（下），中共中央党校出版社1991年版。\n5. 金春明：《毛泽东思想发展史》，中共中央党校出版社1993年版。\n6.《邓小平文选》第2、3卷，人民出版社1994年版。\n7. 江泽民：《论三个代表》，中央文献出版社2001年版。\n8． 历次党大会的报告。\n录像： \n第一章：《走近毛泽东》（ 45分钟），《小平，您好》（ 45分钟）\n第六章：《复兴之路》第一、二集（90分钟）\n第十二章：《台湾问题》（45分钟）\n第十五章：《世界执政党兴衰史鉴》（80分钟）\n六、课程教学网站：\n新网站建设过程中。\n原有网站：\n     http://10.15.11.71/eln/201003011105080171/index.jsp?cosid=1611', '/images/cmdc1.png');
INSERT INTO `course` VALUES ('21191910', '区块链与数字货币', '计算机科学与技术学院', '2.5', null, '区块链和数字货币是近年来受到广泛关注的热点，。本课程介绍数字货币的原理、技术和应用现状，分析目前主流的区块链技术平台以太坊和HyperLedger的技术架构和开发技术，解析企业级联盟链技术平台，介绍区块链应用案例，展望区块链和数字货币的发展趋势，力图成为有兴趣深入学习和研究这一领域学生的导论课程。', '（一）学习目标\n\n   数字货币和区块链技术是近年来的热点，受到国内外众多机构和普通人士的关注。区块链从底层技术层面上确保了信息的不可篡改性，从本质上解决了多方参与系统中的相互不信任问题，众多科技界知名人士和IT巨头均看好区块链技术的发展，认为该技术将对人类社会带来革命性的影响。本课程对数字货币和区块链技术进行了全面的介绍和剖析，引导学生由浅入深地学习区块链技术，并启发和指导学生设计和开发基于区块链的应用，旨在为学生今后深入学习和研究数字货币和区块链技术打下良好基础。\n\n（二）可测量结果\n\n1）掌握数字货币和区块链相关的基本概念、发展历程、技术流派和典型应用场景；\n\n2）了解主流区块链开源平台以太坊和HyperLedger的主要功能和特性，能够搭建以太坊或HyperLedger开发环境，编写智能合约，设计和开发简单的区块链应用项目；\n\n3）学习企业级区块链平台的核心原理，掌握区块链加密与安全机制、共识算法、智能合约及其执行引擎、数据存储机制、部署与监控等关键技术；\n\n4）了解区块链技术的典型应用场景，并能够基于课程所学知识和技术理解数字货币和区块链行业的发展动态，为进一步学习或研究该领域工作打下良好基础。\n\n    注：以上结果可以通过课程作业、期末大作业等环节测量。\n\n\n\n\n三、课程要求\n\n（一）授课方式与要求\n\n授课方式：a.教师讲授（讲授核心内容、总结、按顺序提示今后内容、答疑等）；b.课后练习和团队作业（结合授课内容给出课后练习和期末大作业题目，分小组进行大作业设计和开发）； \n\n课程要求：熟悉区块链和数字货币相关基本概念和技术知识，提高中外文金融科技领域文献的阅读能力，形成对金融科技领域的学习和研究兴趣。\n\n（二）考试评分与建议\n\n    课程平时作业与课堂表现占40％，课程大作业占60％。\n\n四、教学安排\n\n第一次： 数字货币技术原理\n\n主要内容：介绍数字货币的产生历史和概念，剖析数字货币的技术原理、区块链基本概念、核心技术特性和价值。\n\n第二次： 数字货币生态\n\n主要内容：介绍数字货币的生态体系，包括数字货币的发行、使用、支付、交易、应用等环节，数字货币和区块链的产业链分析，目前区块链主要技术流派和平台简介。\n\n第三次： 以太坊技术架构\n\n主要内容：介绍知名区块链开源平台以太坊的基本概念、技术原理和架构，重点讲述智能合约的概念和原理，剖析TheDAO被攻击等重大事件，分析以太坊平台存在的问题。\n\n第四次： 以太坊技术开发\n\n主要内容：介绍以太坊应用的开发过程，讲授以太坊的集成开发环境、编程接口等，用实际案例说明如何开发一个区块链应用。\n\n第五次：HyperLedger技术架构\n\n主要内容：HyperLedger是著名开源区块链平台，目前得到众多国际大企业的参与和支持，本次课程介绍HyperLedger基本概念、原理、chaincode，以及HyperLedger开发环境、编程接口、应用开放框架与流程等。\n\n第六次： 企业级联盟链技术平台\n\n主要内容： 联盟链是针对企业级应用的区块链平台，适合众多企业级用户的需求。本次课程剖析一个企业级区块链平台的主要功能和核心原理，包括：区块链加密与安全机制、区块链共识算法、智能合约及其执行引擎、数据存储机制、区块链部署与监控等。\n\n第七次：区块链应用案例\n\n主要内容：区块链的去中心化特性和价值传递作用，在众多领域体现出独特的应用价值。本次课程逐一介绍分析区块链在跨境支付、供应链金融、国际贸易、证据保全领域的一些典型或成功应用案例。\n\n第八次：数字货币与区块链发展趋势 \n\n主要内容：介绍数字货币和区块链发展的最新动态、各国政府和金融机构对数字货币的态度、区块链技术面临的挑战和发展动态、国内外相关产业发展趋势等。\n五、参考教材及相关资料\n   蔡亮、李启雷、梁秀波著，《区块链技术进阶与实战》，人民邮电出版社，2018.\n六、课程教学网站：\n     将通过校内网络提供必要的课件和文字材料链接', null);
INSERT INTO `course` VALUES ('21191920', '数据驱动安全', '计算机科学与技术学院', '2.0', '高级数据结构与算法分析、机器学习基础、信息安全原理', '本课程主要涉及三个方面的内容：（1）数据驱动安全基础：数据分析理论、威胁情报分析技术、网络攻防技术、隐私保护技术等基础理论与技术；（2）数据驱动安全关键技术及应用：口令攻击与防御、验证码攻击与防御、网络威胁与犯罪分析；（3）高级数据安全：对抗学习理论以及对抗图像、对抗文本、对抗音视频等对抗样本生成技术。', '（一）学习目标\n\n 信息安全技术是信息技术领域的重要研究课题，其本身注重实战与攻防。本课程是一门面向信息安全专业及计算机科学相关专业高年级本科生开设的专业选修课，以数据驱动安全隐私为主线，密切结合数据驱动安全隐私实战案例，讲授数据分析的基本方法与技术、数据驱动安全理论与技术、及数据驱动隐私理论与技术。此课程可以拓宽学生视野，培养学生将数据驱动安全隐私理论技术与现实应用结合的能力，以及后续从事相关理论和应用研究的能力。\n （二）可测量结果\n能掌握大数据分析的基本理论和技术，能在实践中应用相关技术。\n能掌握数据驱动安全的基本技术、应用场景、评估技术、分析方法。\n能掌握数据驱动隐私的基本技术、应用场景、评估技术、分析方法。\n初步掌握数据驱动安全隐私领域问题的发现方法、定义方法、研究方法和解决方法。\n形成相关科学文献的阅读能力。\n具有在讨论和团队作业中的批评与合作能力。\n\n注：以上结果可以通过课堂讨论、课程作业以及课程项目等环节测量。\n\n三、课程要求\n（一）授课方式与要求\n授课方式：a.教师讲授（讲授核心内容、总结、按顺序提示今后内容、答疑、公布讨论主题等）；b.课后阅读和团队合作（按照讨论题内容进行和课堂推荐参考文献，分小组进行阅读和讨论发言起草工作）；c. 讨论课（由主题发言和质疑-应答两个环节组成，学生在讨论中如能进行尖锐质疑，则会在其绩效记录中有所体现）；d. 期末课程项目成果展示与答辩。\n课程要求：熟悉基本知识、培养思维和表达能力及合作精神、提高数据驱动安全隐私科学文献的阅读能力，形成对信息安全研究的兴趣。\n\n考试评分与建议\n课程项目（含源代码、项目报告）占65%，期末课程项目答辩占20%，课程作业与课堂讨论占15%。\n四、教学安排\n第一次：绪论\n 主要内容：介绍数据驱动安全的基本术语、假设空间、归纳偏好、发展历程、应用现状等。详细分析一些数据驱动实践与其他学科的交叉实例，帮助学生建立起对安全数据科学工作者所需掌握技能的总体概览。\n阅读材料：Jay Jacobs, Bob Rudis，《Data-driven Security: Analysis, Visualization and Dashboards》第一章，Wiley，February 2014 （中文翻译版：数据驱动安全：数据安全分析、可视化和仪表盘；出版社：机械工业出版社；出版时间：2015年9月；ISBN: 978-7-111-51267-7）\n周志华，《机器学习》第一章，清华大学出版社，2016年1月\n\n第二次：数据驱动安全基础\n 主要内容：介绍数据分析理论、威胁情报分析技术、安全攻防技术、隐私保护技术等基础理论与技术。从数据分析理论出发，帮助学生建立从标准报告、专项报告、告警、统计分析、取证、预测的逐层递进的数据分析视角。结合威胁情报的分析（TIA）的具体应用场景，分析外部的威胁情报共享、本地的威胁情报分析以及情景感知实例。\n阅读材料：  王星，《大数据分析:方法与应用》，清华大学出版社，2013\nLiao X, Yuan K, Li Z, et al. Acing the IOC Game: Toward Automatic Discovery and Analysis of Open-Source Cyber Threat Intelligence[C]// ACM Sigsac Conference on Computer and Communications Security. ACM, 2016:755-766.\nRob McMillan. Open Threat Intelligence. https://www.gartner.com/doc/2487216/definition-threat-intelligence, 2013.\n \n三次：口令安全一\n主要内容：介绍消息认证码、数字签名、证书、PKI等安全密钥技术，在此基础上重点阐述口令攻击的主要方法和危害。口令攻击方法包括社会工程学攻击、猜测攻击、字典攻击、穷举攻击、混合攻击、直接破解系统口令文件、网络嗅探、键盘记录以及中间人攻击、重放攻击、生日攻击、时间攻击等其他攻击方式。最后讲解对口令攻击进行评估的主要因素。\n 阅读材料： 《应用密码学：协议、算法与C源程序》 （原书第2版），作者:Bruce Schneier，出版社:机械工业出版社，原作名:Applied Cryptography: Protocols, Algorithms, and Source Code in C，译者:吴世忠/祝世雄/张文政 等，出版年:2014-1.\n\n第四次：口令安全二\n 主要内容：介绍口令安全防护的基础理论及技术。重点现代口令防护技术，包括动态密码、钓鱼防范、SSL协议、口令分级、生物特征密码等。最后介绍口令系统的设计和管理，包括防监听技术，授权技术，以及未来密码防御趋势如量子加密等。\n 阅读材料： 《应用密码学：协议、算法与C源程序》 （原书第2版），作者:Bruce Schneier，出版社:机械工业出版社，原作名:Applied Cryptography: Protocols, Algorithms, and Source Code in C，译者:吴世忠/祝世雄/张文政 等，出版年:2014-1.\n\n第五次：验证码安全一\n主要内容：介绍短信验证码、图形验证码、文字验证码、语音验证码、滑动验证码及其对应的识别流程，在此基础上结合Google ReCAPTCHA系统讲解攻击验证码系统的方法，包括基于cookie的方法、训练图片分类器的方法等。\n阅读材料：Sivakorn S, Polakis I, Keromytis A D. I am Robot: (Deep) Learning to Break Semantic Image CAPTCHAs[C]// IEEE European Symposium on Security and Privacy. IEEE, 2016:388-403. \n\n第六次：验证码安全二\n 主要内容：介绍不同验证码系统漏洞以及对应加固方案，包括文字图片干扰、背景干扰、公式验证码、逻辑验证码、用户信息验证码等。重点介绍基于对抗性验证码生成的防护技术。\n阅读材料： Kwon H, Kim Y, Yoon H, et al. CAPTCHA Image Generation Systems Using Generative Adversarial Networks[J]. Ieice Transactions on Information & Systems, 2018, E101.D(2):543-546.\n\n第七次：复杂数据隐私一\n 主要内容：介绍复杂数据隐私攻击理论基础、关键技术和现状趋势等。重点介绍社交网络数据隐私攻击，包括隐私的定义，匿名模型，匿名攻击等。介绍机器学习中的安全与隐私问题，特别介绍基于对抗性样本的攻击。\n阅读材料：Arvind Narayanan, Vitaly Shmatikov，Robust De-anonymization of Large Sparse Datasets (How To Break Anonymity of the Netflix Prize Dataset) ， IEEE S&P 2008.\nArvind Narayanan, Vitaly Shmatikov，De-anonymizing Social Networks ， IEEE S&P 2009.\nShouling Ji, Weiqing Li, Mudhakar Srivatsa, Jing Selena He, and Raheem Beyah, General Graph Data De-anonymization: From Mobility Traces to Social Networks, ACM Transactions on Information and System Security (TISSEC), 2016.\nShouling Ji, Weiqing Li, Mudhakar Srivatsa, and Raheem Beyah, Structural Data De-anonymization: Theory and Practice, to appear in the IEEE/ACM Transactions on Networking (ToN), 2016.\n \n第八次：复杂数据隐私二\n 主要内容：介绍复杂数据隐私保护理论基础、关键技术和现状趋势等。主要介绍数据发布中匿名保护技术，社交网络匿名保护技术，数据水印技术以及数据溯源技术。重点介绍差分隐私技术，分析大数据环境下数据隐私保护面临的挑战及其与机器学习等多个领域的结合应用。\n 阅读材料：Shouling Ji, Prateek Mittal, and Raheem Beyah, Graph Data Anonymization, De-anonymization Attacks, and De-anonymizability Quantification: A Survey, IEEE Communications Surveys & Tutorials (COMST), 2016.\n其他材料另行指定。\n \n第九次：网络威胁与犯罪一\n 讨论电商欺诈与反欺诈的背景与研究现状。介绍电商欺诈手段，包括虚假交易，身份盗窃，联署欺诈，倒卖个人信息等。介绍电商欺诈自动化检测的技术，以及基于大数据的电商行为分析方法。\n 阅读材料：另行发放。\n \n第十次：网络威胁与犯罪二\n 主要内容：研究典型的电信欺诈行为，分析电信欺诈行为的特征。介绍电信反欺诈系统的理论基础和核心技术，包括用户行为画像，欺诈关联图谱和大数据风控评估等。介绍欺诈信息库的建立和维护。 \n 阅读材料：另行发放。\n \n第十一次：网络威胁与犯罪三\n 主要内容：介绍电商黑灰产的主要类型和作弊手段，包括刷单，刷评论，虚假流量，广告作弊等。介绍电商平台下的反作弊算法，包括交易行为序列建模，大规模图挖掘技术，图标签传播模型等。\n 阅读材料：另行发放。\n \n第十二次：网络威胁与犯罪四\n 主要内容：介绍搜索黑灰产中的作弊方法和技术，包括关键词堆砌，点击农场，垃圾链接等。介绍讨论搜索作弊检测关键技术，包括黑帽SEO检测，虚假关键词检测等内容。\n 阅读材料：另行发放。\n \n第十三次：对抗学习一\n 主要内容：介绍对抗学习理论技术在图像分析处理领域的应用，重点介绍对抗图像生成技术，并分析对抗图像对图片分类器、验证码识别器、人脸识别等机器学习模型应用的攻击原理及效果。\n 阅读材料：Akhtar N, Mian A. Threat of Adversarial Attacks on Deep Learning in Computer Vision: A Survey[J]. IEEE Access, 2018.\n \n第十四次：对抗学习二\n主要内容：介绍对抗学习理论技术在音频分析处理领域的应用，重点介绍对抗音频生成技术，并分析对抗音频对语音识别、音频场景分析、音乐流派分类等机器学习模型应用的攻击原理及效果。\n阅读材料：Carlini N, Wagner D. Audio Adversarial Examples: Targeted Attacks on Speech-to-Text[J]. arXiv preprint arXiv:1801.01944, 2018.\nKereliuk C, Sturm B L, Larsen J. Deep learning and music adversaries[J]. IEEE Transactions on Multimedia, 2015, 17(11): 2059-2071.\n \n第十五次：对抗学习三\n 主要内容：介绍对抗学习理论技术在文本分析处理领域的应用，重点介绍对抗文本生成技术，并分析对抗文本对情感分析、垃圾邮件过滤、虚假评论检测等机器学习模型应用的攻击原理及效果。\n 阅读材料：Liang B, Li H, Su M, et al. Deep Text Classification Can be Fooled[J]. 2017.\n \n第十六次：课程项目答辩\n 主要内容：课程项目成果展示与答辩等。\n \n四、参考教材及相关资料\nJay Jacobs, Bob Rudis，《Data-driven Security: Analysis, Visualization and Dashboards》，Wiley，February 2014 （中文翻译版：数据驱动安全：数据安全分析、可视化和仪表盘；出版社：机械工业出版社；出版时间：2015年9月；ISBN: 978-7-111-51267-7）\n周志华，《机器学习》，清华大学出版社，2016年1月\nWilliam Stallings，《Network Security Essentials: Applications and Standards (5th Edition)》，Pearson，March 2013 （中文翻译版：网络安全基础：应用与标准；出版社：清华大学出版社；出版时间：2014年5月；ISBN: 978-7-302-34807-8）\nChris Hadnagy，《Social Engineering: The Art of Human Hacking》，Brilliance Audio，March 2014 （中文翻译版：社会工程：安全体系中的人性漏洞；出版社：人民邮电出版社；出版时间：2013年12月；ISBN: 978-7-115-33538-8）\n\n五、课程教学网站：http://nesa.zju.edu.cn', '/images/cmdc1.png');

-- ----------------------------
-- Table structure for msgboard
-- ----------------------------
DROP TABLE IF EXISTS `msgboard`;
CREATE TABLE `msgboard` (
  `msgId` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contact` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`msgId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of msgboard
-- ----------------------------
INSERT INTO `msgboard` VALUES ('1', '哈哈哈哈哈', '123');
INSERT INTO `msgboard` VALUES ('2', 'hhhh', '123');

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice` (
  `noticeID` int(32) NOT NULL AUTO_INCREMENT,
  `courseID` varchar(32) NOT NULL,
  `time` datetime(6) NOT NULL,
  `content` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`noticeID`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of notice
-- ----------------------------

-- ----------------------------
-- Table structure for take
-- ----------------------------
DROP TABLE IF EXISTS `take`;
CREATE TABLE `take` (
  `studentID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `classID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `usualGrade` int(3) DEFAULT NULL,
  `examGrade` int(3) DEFAULT NULL,
  KEY `classID` (`classID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `take_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `class` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `take_ibfk_2` FOREIGN KEY (`studentID`) REFERENCES `user` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of take
-- ----------------------------
INSERT INTO `take` VALUES ('1111', 'Class01', null, null);
INSERT INTO `take` VALUES ('1111', 'Class02', null, null);
INSERT INTO `take` VALUES ('2222', 'Class01', null, null);
INSERT INTO `take` VALUES ('2222', 'Class03', null, null);
INSERT INTO `take` VALUES ('3333', 'Class03', null, null);
INSERT INTO `take` VALUES ('4444', 'Class01', null, null);
INSERT INTO `take` VALUES ('5555', 'Class01', null, null);
INSERT INTO `take` VALUES ('6666', 'Class01', null, null);
INSERT INTO `take` VALUES ('7777', 'Class01', null, null);

-- ----------------------------
-- Table structure for talk
-- ----------------------------
DROP TABLE IF EXISTS `talk`;
CREATE TABLE `talk` (
  `talkID` varchar(32) NOT NULL,
  `courseID` varchar(32) NOT NULL,
  `userID` varchar(32) NOT NULL,
  `title` varchar(64) NOT NULL,
  `content` varchar(512) NOT NULL,
  `time` timestamp(6) NOT NULL,
  PRIMARY KEY (`talkID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of talk
-- ----------------------------

-- ----------------------------
-- Table structure for teacher_info
-- ----------------------------
DROP TABLE IF EXISTS `teacher_info`;
CREATE TABLE `teacher_info` (
  `teacherID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `position` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `patent` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `course` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `papers` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
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
  `userID` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userPwd` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phoneNumber` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `gender` int(1) DEFAULT NULL,
  `userType` int(1) NOT NULL DEFAULT '0',
  `userPhoto` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `userIntro` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1111', '应承峻', '123', '3170103456@zju.edu.cn', '17326084929', '1999-06-22', '1', '0', 'photos/1574833836929.jpeg', 'HTT是憨批');
INSERT INTO `user` VALUES ('2222', '学生A', '123', 'S0001@qq.com', null, null, null, '0', null, null);
INSERT INTO `user` VALUES ('3333', '学生B', '123', 'S0002@qq.com', null, null, null, '0', null, null);
INSERT INTO `user` VALUES ('4444', '学生C', '123', 'S0003@qq.com', null, null, null, '0', null, null);
INSERT INTO `user` VALUES ('5555', '学生D', '123', 'S0004@qq.com', null, null, null, '0', null, null);
INSERT INTO `user` VALUES ('6666', '学生E', '123', 'S0005@qq.com', null, null, null, '0', null, null);
INSERT INTO `user` VALUES ('7777', '学生F', '123', 'S0006@qq.com', null, null, null, '0', null, null);
INSERT INTO `user` VALUES ('admin_01', 'admin', '123', '1052257712@zju.edu.cn', null, null, '1', '2', null, null);
INSERT INTO `user` VALUES ('AS0001', '助教A', '123', 'A0001@qq.com', null, null, null, '0', null, null);
INSERT INTO `user` VALUES ('T0001', '教师A', '123', 'T0001@qq.com', null, null, null, '1', null, null);
INSERT INTO `user` VALUES ('T0002', '教师B', '123', 'T0002@qq.com', null, null, null, '1', null, null);
INSERT INTO `user` VALUES ('T0003', '教师C', '123', 'T0003@qq.com', null, null, null, '1', null, null);
INSERT INTO `user` VALUES ('T0004', '教师D', '123', 'T0004@qq.com', null, null, null, '1', null, null);
INSERT INTO `user` VALUES ('T0005', '教师E', '123', 'T0005@qq.com', null, null, null, '1', null, null);

-- ----------------------------
-- View structure for class_group_view
-- ----------------------------
DROP VIEW IF EXISTS `class_group_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `class_group_view` AS select `class_group_member`.`studentID` AS `studentID`,`p`.`groupID` AS `groupID`,`p`.`classID` AS `classID`,`p`.`groupNumber` AS `groupNumber`,`p`.`groupLeaderID` AS `groupLeaderID`,`p`.`groupLeaderName` AS `groupLeaderName`,`x`.`studentName` AS `studentName` from (((select `class_group`.`groupID` AS `groupID`,`class_group`.`classID` AS `classID`,`class_group`.`groupNumber` AS `groupNumber`,`class_group`.`groupLeaderID` AS `groupLeaderID`,`user`.`userName` AS `groupLeaderName` from (`class_group` join `user`) where (`class_group`.`groupLeaderID` = `user`.`userID`)) `p` left join `class_group_member` on((`p`.`groupID` = `class_group_member`.`groupID`))) left join (select `user`.`userID` AS `studentID`,`user`.`userName` AS `studentName` from `user`) `x` on((`class_group_member`.`studentID` = `x`.`studentID`))) where (`p`.`classID` = 'Class01') ;

-- ----------------------------
-- View structure for class_member
-- ----------------------------
DROP VIEW IF EXISTS `class_member`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `class_member` AS select `take`.`studentID` AS `studentID`,`take`.`classID` AS `classID`,`take`.`usualGrade` AS `usualGrade`,`take`.`examGrade` AS `examGrade`,`x`.`userName` AS `userName` from (`take` join (select `user`.`userID` AS `studentID`,`user`.`userName` AS `userName` from `user`) `x` on((`take`.`studentID` = `x`.`studentID`))) ;

-- ----------------------------
-- View structure for project_stat
-- ----------------------------
DROP VIEW IF EXISTS `project_stat`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `project_stat` AS select `class_project`.`classProjectID` AS `classProjectID`,`class_project`.`projectName` AS `projectName`,`class_project`.`classID` AS `classID`,`class_project`.`description` AS `description`,`class_project`.`fullMark` AS `fullMark`,`class_project`.`startTime` AS `startTime`,`class_project`.`closeTime` AS `closeTime`,`class_project`.`isGroupWork` AS `isGroupWork`,`class_project_score`.`studentID` AS `studentID`,`class_project_score`.`filePath` AS `filePath`,`class_project_score`.`commitMsg` AS `commitMsg`,`class_project_score`.`commitTime` AS `commitTime`,`class_project_score`.`mark` AS `mark`,`class_project_score`.`markTime` AS `markTime`,`class_project_score`.`comment` AS `comment`,`class_project_score`.`complainMsg` AS `complainMsg` from (`class_project` join `class_project_score` on((`class_project`.`classProjectID` = `class_project_score`.`classProjectID`))) ;
