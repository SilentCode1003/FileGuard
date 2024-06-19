/*
  Warnings:

  - Added the required column `usersUserId` to the `Folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `folders` ADD COLUMN `usersUserId` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `Folders` ADD CONSTRAINT `Folders_usersUserId_fkey` FOREIGN KEY (`usersUserId`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
