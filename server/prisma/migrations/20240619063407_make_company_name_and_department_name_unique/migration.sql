/*
  Warnings:

  - A unique constraint covering the columns `[comp_name]` on the table `Companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[dept_name]` on the table `Departments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `companies` MODIFY `comp_name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `departments` MODIFY `dept_name` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Companies_comp_name_key` ON `Companies`(`comp_name`);

-- CreateIndex
CREATE UNIQUE INDEX `Departments_dept_name_key` ON `Departments`(`dept_name`);
