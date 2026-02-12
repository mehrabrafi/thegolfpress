/*
  Warnings:

  - You are about to drop the column `authorId` on the `News` table. All the data in the column will be lost.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_authorId_fkey";

-- AlterTable
ALTER TABLE "News" DROP COLUMN "authorId";

-- DropTable
DROP TABLE "Author";
