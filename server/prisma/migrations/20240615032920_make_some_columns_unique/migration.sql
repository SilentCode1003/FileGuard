/*
  Warnings:

  - A unique constraint covering the columns `[perm_name]` on the table `Permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ur_name]` on the table `UserRoles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_username]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Permissions_perm_name_key` ON `Permissions`(`perm_name`);

-- CreateIndex
CREATE UNIQUE INDEX `UserRoles_ur_name_key` ON `UserRoles`(`ur_name`);

-- CreateIndex
CREATE UNIQUE INDEX `Users_user_username_key` ON `Users`(`user_username`);
