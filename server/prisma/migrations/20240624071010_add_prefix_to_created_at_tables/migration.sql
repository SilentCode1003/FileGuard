/*
  Warnings:

  - You are about to drop the column `createdAt` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `folders` table. All the data in the column will be lost.
  - You are about to drop the column `revCreatedAt` on the `revisions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `userlogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `files` DROP COLUMN `createdAt`,
    ADD COLUMN `file_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `folders` DROP COLUMN `createdAt`,
    ADD COLUMN `folder_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `revisions` DROP COLUMN `revCreatedAt`,
    ADD COLUMN `rev_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `userlogs` DROP COLUMN `createdAt`,
    ADD COLUMN `ul_created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
