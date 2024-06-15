/*
  Warnings:

  - You are about to drop the column `ur_perm_id` on the `UserRoles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserRoles` DROP FOREIGN KEY `UserRoles_ur_perm_id_fkey`;

-- AlterTable
ALTER TABLE `UserRoles` DROP COLUMN `ur_perm_id`;

-- AddForeignKey
ALTER TABLE `Permissions` ADD CONSTRAINT `Permissions_perm_ur_id_fkey` FOREIGN KEY (`perm_ur_id`) REFERENCES `UserRoles`(`ur_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
