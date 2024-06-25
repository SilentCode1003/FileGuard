/*
  Warnings:

  - Added the required column `user_comp_id` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_dept_id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `user_comp_id` VARCHAR(100) NOT NULL,
    ADD COLUMN `user_dept_id` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_user_comp_id_fkey` FOREIGN KEY (`user_comp_id`) REFERENCES `Companies`(`comp_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_user_dept_id_fkey` FOREIGN KEY (`user_dept_id`) REFERENCES `Departments`(`dept_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
