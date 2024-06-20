-- CreateTable
CREATE TABLE `Files` (
    `file_id` VARCHAR(100) NOT NULL,
    `file_user_id` VARCHAR(100) NOT NULL,
    `file_name` TEXT NOT NULL,
    `file_path` TEXT NOT NULL,
    `file_base` BLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Folders` (
    `folder_id` VARCHAR(100) NOT NULL,
    `folder_name` TEXT NOT NULL,
    `folder_path` TEXT NOT NULL,
    `folder_parent_id` VARCHAR(100) NULL,
    `folder_user_id` VARCHAR(100) NOT NULL,
    `folder_depth` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`folder_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FolderFiles` (
    `ff_id` VARCHAR(100) NOT NULL,
    `ff_folder_id` VARCHAR(100) NOT NULL,
    `ff_file_id` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`ff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Companies` (
    `comp_id` VARCHAR(100) NOT NULL,
    `comp_name` TEXT NOT NULL,

    PRIMARY KEY (`comp_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Departments` (
    `dept_id` VARCHAR(100) NOT NULL,
    `dept_name` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`dept_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyDepartments` (
    `cd_id` VARCHAR(100) NOT NULL,
    `cd_comp_id` VARCHAR(100) NOT NULL,
    `cd_dept_id` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`cd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLogs` (
    `ul_id` VARCHAR(100) NOT NULL,
    `ul_user_id` VARCHAR(100) NOT NULL,
    `ul_description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ul_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FileContents` (
    `fc_id` VARCHAR(100) NOT NULL,
    `fc_file_id` VARCHAR(100) NOT NULL,
    `fc_content` LONGTEXT NOT NULL,

    PRIMARY KEY (`fc_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FolderFiles` ADD CONSTRAINT `FolderFiles_ff_folder_id_fkey` FOREIGN KEY (`ff_folder_id`) REFERENCES `Folders`(`folder_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FolderFiles` ADD CONSTRAINT `FolderFiles_ff_file_id_fkey` FOREIGN KEY (`ff_file_id`) REFERENCES `Files`(`file_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyDepartments` ADD CONSTRAINT `CompanyDepartments_cd_comp_id_fkey` FOREIGN KEY (`cd_comp_id`) REFERENCES `Companies`(`comp_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompanyDepartments` ADD CONSTRAINT `CompanyDepartments_cd_dept_id_fkey` FOREIGN KEY (`cd_dept_id`) REFERENCES `Departments`(`dept_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLogs` ADD CONSTRAINT `UserLogs_ul_user_id_fkey` FOREIGN KEY (`ul_user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileContents` ADD CONSTRAINT `FileContents_fc_file_id_fkey` FOREIGN KEY (`fc_file_id`) REFERENCES `Files`(`file_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
