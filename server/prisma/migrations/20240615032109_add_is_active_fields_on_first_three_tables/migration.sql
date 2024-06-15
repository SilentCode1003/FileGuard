/*
  Warnings:

  - Added the required column `perm_is_active` to the `Permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ur_is_active` to the `UserRoles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_is_active` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Permissions` ADD COLUMN `perm_is_active` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `UserRoles` ADD COLUMN `ur_is_active` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `user_is_active` BOOLEAN NOT NULL;
