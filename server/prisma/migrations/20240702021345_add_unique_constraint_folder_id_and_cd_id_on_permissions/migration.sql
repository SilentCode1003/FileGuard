/*
  Warnings:

  - A unique constraint covering the columns `[perm_folder_id,perm_cd_id]` on the table `Permissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Permissions_perm_folder_id_perm_cd_id_key` ON `Permissions`(`perm_folder_id`, `perm_cd_id`);
