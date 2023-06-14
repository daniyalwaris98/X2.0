CREATE TABLE IF NOT EXISTS `AtomDB`.`license_verification_table`(
  `LICENSE_ID` INT AUTO_INCREMENT NOT NULL,
  `COMPANY_NAME` VARCHAR(500) NOT NULL,
  `VERIFICATION_LICENSE_KEY` VARCHAR(2500) NULL,
  `START_DATE` DATETIME NULL,
  `END_DATE` DATETIME NULL,
  PRIMARY KEY (`LICENSE_ID`)
);


CREATE TABLE IF NOT EXISTS `AtomDB`.`end_user_table`(
  `END_USER_ID` INT AUTO_INCREMENT NOT NULL,
  `COMPANY_NAME` VARCHAR(500) NOT NULL UNIQUE,
  `PO_BOX` VARCHAR(50) NULL,
  `ADDRESS` VARCHAR(2500) NULL,
  `STREET_NAME` VARCHAR(500) NULL,
  `CITY` VARCHAR(500) NULL,
  `COUNTRY` VARCHAR(500) NULL,
  `CONTACT_PERSON` VARCHAR(500) NULL,
  `CONTACT_NUMBER` VARCHAR(500) NULL,
  `EMAIL` VARCHAR(500) NULL,
  `DOMAIN_NAME` VARCHAR(500) NULL,
  `INDUSTRY_TYPE` VARCHAR(500) NULL,
  `CREATION_DATE` DATETIME NULL,
  `MODIFICATION_DATE` DATETIME NULL,
  `LICENSE_STATUS` VARCHAR(50) NULL,
  PRIMARY KEY (`END_USER_ID`)
);




CREATE TABLE IF NOT EXISTS `AtomDB`.`admin_roles`(
  `ROLE_ID` INT AUTO_INCREMENT NOT NULL,
  `ROLE` VARCHAR(50) NOT NULL,
  `CONFIGURATION` VARCHAR(5000) NULL,
  `CREATION_DATE` DATETIME NULL,
  `MODIFICATION_DATE` DATETIME NULL,
  PRIMARY KEY (`ROLE_ID`)
);



CREATE TABLE IF NOT EXISTS `AtomDB`.`user_table` (

    `ID` INT AUTO_INCREMENT NOT NULL,
    `USER_ID` VARCHAR(50) NOT NULL UNIQUE,
    `EMAIL` VARCHAR(50) NULL,
    `NAME` VARCHAR(200) NOT NULL,
    `ROLE_ID` INT NOT NULL,
    `STATUS` VARCHAR(200) NOT NULL,
    `ACCOUNT_TYPE` VARCHAR(15) NULL,
    `PASSWORD` VARCHAR(512) NOT NULL,
    `CREATION_DATE` DATETIME NULL,
    `MODIFICATION_DATE` DATETIME NULL,
    `LAST_LOGIN` DATETIME NULL,
    `TEAM` VARCHAR(50) NULL,
    `VENDOR` VARCHAR(50) NULL,
    `END_USER_ID` INT NULL,

    PRIMARY KEY (`ID`),
    FOREIGN KEY (`ROLE_ID`) REFERENCES admin_roles(`ROLE_ID`),
    FOREIGN KEY (`END_USER_ID`) REFERENCES license_verification_table(`END_USER_ID`)
);



CREATE TABLE IF NOT EXISTS `AtomDB`.`module_activity_table`(
    `ID` INT AUTO_INCREMENT NOT NULL,
    `USER_ID` VARCHAR(50) NOT NULL,
    `MODULE_FROM` VARCHAR(50) NOT NULL,
    `MODULE_TO` VARCHAR(50) NOT NULL,
    `OBJECT_ID` VARCHAR(50) NOT NULL,
    `OPERATION` VARCHAR(50) NOT NULL,
    `STATUS` VARCHAR(50) NOT NULL,
    `DESCRIPTION` VARCHAR(200) NOT NULL,
    `TIMESTAMP` DATETIME
)



CREATE TABLE IF NOT EXISTS `AtomDB`.`login_activity_table`(
    `ID` INT AUTO_INCREMENT NOT NULL,
    `USER_ID` VARCHAR(50) NOT NULL,
    `OPERATION` VARCHAR(50) NOT NULL,
    `STATUS` VARCHAR(50) NOT NULL,
    `DESCRIPTION` VARCHAR(200) NOT NULL,
    `TIMESTAMP` DATETIME
)
