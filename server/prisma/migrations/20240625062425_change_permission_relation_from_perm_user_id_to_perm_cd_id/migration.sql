/*
  Warnings:

  - You are about to drop the column `perm_ur_id` on the `permissions` table. All the data in the column will be lost.
  - Added the required column `perm_cd_id` to the `Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `permissions` DROP FOREIGN KEY `Permissions_perm_ur_id_fkey`;

-- AlterTable
ALTER TABLE `permissions` DROP COLUMN `perm_ur_id`,
    ADD COLUMN `perm_cd_id` VARCHAR(100) NOT NULL,
    ADD COLUMN `usersUserId` VARCHAR(100) NULL;

-- AddForeignKey
ALTER TABLE `Permissions` ADD CONSTRAINT `Permissions_perm_cd_id_fkey` FOREIGN KEY (`perm_cd_id`) REFERENCES `CompanyDepartments`(`cd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permissions` ADD CONSTRAINT `Permissions_usersUserId_fkey` FOREIGN KEY (`usersUserId`) REFERENCES `Users`(`user_id`) ON DELETE SET NULL ON UPDATE CASCADE;
