-- DropForeignKey
ALTER TABLE `permissions` DROP FOREIGN KEY `Permissions_perm_ur_id_fkey`;

-- AddForeignKey
ALTER TABLE `Permissions` ADD CONSTRAINT `Permissions_perm_ur_id_fkey` FOREIGN KEY (`perm_ur_id`) REFERENCES `Users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
