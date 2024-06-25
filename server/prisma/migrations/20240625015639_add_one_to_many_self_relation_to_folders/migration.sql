-- AddForeignKey
ALTER TABLE `Folders` ADD CONSTRAINT `Folders_folder_parent_id_fkey` FOREIGN KEY (`folder_parent_id`) REFERENCES `Folders`(`folder_id`) ON DELETE SET NULL ON UPDATE CASCADE;
