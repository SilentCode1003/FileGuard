/*
  Warnings:

  - You are about to drop the column `perm_name` on the `Permissions` table. All the data in the column will be lost.
  - Added the required column `perm_folder_id` to the `Permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perm_ur_id` to the `Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Permissions_perm_name_key` ON `Permissions`;

-- AlterTable
ALTER TABLE `Permissions` DROP COLUMN `perm_name`,
    ADD COLUMN `perm_folder_id` VARCHAR(100) NOT NULL,
    ADD COLUMN `perm_ur_id` VARCHAR(100) NOT NULL,
    MODIFY `perm_is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `UserRoles` MODIFY `ur_is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Users` MODIFY `user_is_active` BOOLEAN NOT NULL DEFAULT true;
