/*
  Warnings:

  - You are about to alter the column `file_base` on the `files` table. The data in that column could be lost. The data in that column will be cast from `Blob` to `LongText`.

*/
-- AlterTable
ALTER TABLE `files` MODIFY `file_base` LONGTEXT NOT NULL;
