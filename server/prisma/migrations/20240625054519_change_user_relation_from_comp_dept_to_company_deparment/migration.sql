/*
  Warnings:

  - You are about to drop the column `user_comp_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `user_dept_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `user_cd_id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_user_comp_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_user_dept_id_fkey`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `user_comp_id`,
    DROP COLUMN `user_dept_id`,
    ADD COLUMN `user_cd_id` VARCHAR(100) NOT NULL;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_user_cd_id_fkey` FOREIGN KEY (`user_cd_id`) REFERENCES `CompanyDepartments`(`cd_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
