-- CreateTable
CREATE TABLE `Permissions` (
    `perm_id` VARCHAR(100) NOT NULL,
    `perm_name` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`perm_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRoles` (
    `ur_id` VARCHAR(100) NOT NULL,
    `ur_name` VARCHAR(60) NOT NULL,
    `ur_perm_id` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`ur_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `user_id` VARCHAR(100) NOT NULL,
    `user_fullname` VARCHAR(60) NOT NULL,
    `user_username` VARCHAR(60) NOT NULL,
    `user_password` VARCHAR(60) NOT NULL,
    `user_role_id` VARCHAR(60) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserRoles` ADD CONSTRAINT `UserRoles_ur_perm_id_fkey` FOREIGN KEY (`ur_perm_id`) REFERENCES `Permissions`(`perm_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_user_role_id_fkey` FOREIGN KEY (`user_role_id`) REFERENCES `UserRoles`(`ur_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
