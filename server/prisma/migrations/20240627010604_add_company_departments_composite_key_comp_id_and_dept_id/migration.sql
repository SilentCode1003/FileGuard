/*
  Warnings:

  - A unique constraint covering the columns `[cd_comp_id,cd_dept_id]` on the table `CompanyDepartments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CompanyDepartments_cd_comp_id_cd_dept_id_key` ON `CompanyDepartments`(`cd_comp_id`, `cd_dept_id`);
