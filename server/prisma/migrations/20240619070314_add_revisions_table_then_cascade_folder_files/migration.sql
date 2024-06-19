-- DropForeignKey
ALTER TABLE `folderfiles` DROP FOREIGN KEY `FolderFiles_ff_file_id_fkey`;

-- DropForeignKey
ALTER TABLE `folderfiles` DROP FOREIGN KEY `FolderFiles_ff_folder_id_fkey`;

-- CreateTable
CREATE TABLE `Revisions` (
    `rev_id` VARCHAR(100) NOT NULL,
    `rev_file_id` VARCHAR(100) NOT NULL,
    `rev_file_name` TEXT NOT NULL,
    `rev_file_path` TEXT NOT NULL,
    `rev_file_base` LONGTEXT NOT NULL,
    `revCreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `rev_user_id` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`rev_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FolderFiles` ADD CONSTRAINT `FolderFiles_ff_folder_id_fkey` FOREIGN KEY (`ff_folder_id`) REFERENCES `Folders`(`folder_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FolderFiles` ADD CONSTRAINT `FolderFiles_ff_file_id_fkey` FOREIGN KEY (`ff_file_id`) REFERENCES `Files`(`file_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revisions` ADD CONSTRAINT `Revisions_rev_file_id_fkey` FOREIGN KEY (`rev_file_id`) REFERENCES `Files`(`file_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revisions` ADD CONSTRAINT `Revisions_rev_user_id_fkey` FOREIGN KEY (`rev_user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
