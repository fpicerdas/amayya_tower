
-- CREATE DATABASE IF NOT EXISTS `beliacce_gsja` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci	;
-- USE `beliacce_gsja`;

-- Delete user table
-- DROP TABLE `user`;

-- Create user table
CREATE TABLE IF NOT EXISTS `user` (
	`id` int(11) NOT NULL AUTO_INCREMENT ,
	`fullname` varchar(360) NOT NULL ,
	`uname` varchar(128) NOT NULL ,
	`pwd` varchar(128) NOT NULL ,
	`address` text NOT NULL ,
	`phone` tinytext NOT NULL ,
	`email` tinytext NOT NULL ,
	UNIQUE KEY `uname` (`uname`),
	PRIMARY KEY (`id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


