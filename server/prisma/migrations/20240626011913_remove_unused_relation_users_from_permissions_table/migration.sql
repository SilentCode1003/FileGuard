/*
  Warnings:

  - You are about to drop the column `usersUserId` on the `permissions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `permissions` DROP FOREIGN KEY `Permissions_usersUserId_fkey`;

-- AlterTable
ALTER TABLE `permissions` DROP COLUMN `usersUserId`;
