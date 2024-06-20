/*
  Warnings:

  - You are about to drop the column `usersUserId` on the `folders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `folders` DROP FOREIGN KEY `Folders_usersUserId_fkey`;

-- AlterTable
ALTER TABLE `folders` DROP COLUMN `usersUserId`;

-- AddForeignKey
ALTER TABLE `Permissions` ADD CONSTRAINT `Permissions_perm_folder_id_fkey` FOREIGN KEY (`perm_folder_id`) REFERENCES `Folders`(`folder_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Folders` ADD CONSTRAINT `Folders_folder_user_id_fkey` FOREIGN KEY (`folder_user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
