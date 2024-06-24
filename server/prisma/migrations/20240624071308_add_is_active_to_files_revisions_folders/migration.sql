-- AlterTable
ALTER TABLE `files` ADD COLUMN `file_is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `folders` ADD COLUMN `folder_is_active` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `revisions` ADD COLUMN `rev_is_active` BOOLEAN NOT NULL DEFAULT true;
