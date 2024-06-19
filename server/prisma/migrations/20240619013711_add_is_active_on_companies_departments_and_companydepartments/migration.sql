-- AlterTable
ALTER TABLE `companies` ADD COLUMN `compIsActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `companydepartments` ADD COLUMN `cdIsActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `departments` ADD COLUMN `deptIsActive` BOOLEAN NOT NULL DEFAULT true;
