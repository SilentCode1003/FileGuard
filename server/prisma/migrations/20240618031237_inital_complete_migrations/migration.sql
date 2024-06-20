-- CreateTable
CREATE TABLE `Revissions` (
    `revfile_id` VARCHAR(100) NOT NULL,
    `revfile_user_id` VARCHAR(100) NOT NULL,
    `revfile_name` TEXT NOT NULL,
    `revfile_path` TEXT NOT NULL,
    `revfile_created_at` DATETIME NOT NULL,
    `revfile_base` LONGTEXT NOT NULL,
    `revfile_file_id` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`revfile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Revissions` ADD CONSTRAINT `Revissions_revfile_user_id_fkey` FOREIGN KEY (`revfile_user_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revissions` ADD CONSTRAINT `Revissions_revfile_file_id_fkey` FOREIGN KEY (`revfile_file_id`) REFERENCES `Files`(`file_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
