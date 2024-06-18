-- AddForeignKey
ALTER TABLE `Files` ADD CONSTRAINT `Files_file_user_id_fkey` FOREIGN KEY (`file_user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
