-- AlterTable
ALTER TABLE `folderfiles` ADD COLUMN `ff_rev_id` VARCHAR(100) NULL,
    MODIFY `ff_file_id` VARCHAR(100) NULL;

-- AddForeignKey
ALTER TABLE `FolderFiles` ADD CONSTRAINT `FolderFiles_ff_rev_id_fkey` FOREIGN KEY (`ff_rev_id`) REFERENCES `Revisions`(`rev_id`) ON DELETE CASCADE ON UPDATE CASCADE;
