/*
  Warnings:

  - You are about to drop the `folderfiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `revissions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `file_folder_id` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rev_file_folder_id` to the `Revisions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `folderfiles` DROP FOREIGN KEY `FolderFiles_ff_file_id_fkey`;

-- DropForeignKey
ALTER TABLE `folderfiles` DROP FOREIGN KEY `FolderFiles_ff_folder_id_fkey`;

-- DropForeignKey
ALTER TABLE `folderfiles` DROP FOREIGN KEY `FolderFiles_ff_rev_id_fkey`;

-- DropForeignKey
ALTER TABLE `revissions` DROP FOREIGN KEY `Revissions_revfile_file_id_fkey`;

-- DropForeignKey
ALTER TABLE `revissions` DROP FOREIGN KEY `Revissions_revfile_user_id_fkey`;

-- AlterTable
ALTER TABLE `files` ADD COLUMN `file_folder_id` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `revisions` ADD COLUMN `rev_file_folder_id` VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE `folderfiles`;

-- DropTable
DROP TABLE `revissions`;

-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_file_folder_id_fkey` FOREIGN KEY (`file_folder_id`) REFERENCES `Folders`(`folder_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revisions` ADD CONSTRAINT `Revisions_rev_file_folder_id_fkey` FOREIGN KEY (`rev_file_folder_id`) REFERENCES `Folders`(`folder_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
