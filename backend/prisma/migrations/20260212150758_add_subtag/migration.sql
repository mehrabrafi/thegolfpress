-- AlterTable
ALTER TABLE "News" ADD COLUMN     "subTagId" TEXT;

-- CreateTable
CREATE TABLE "SubTag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "SubTag_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubTag" ADD CONSTRAINT "SubTag_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_subTagId_fkey" FOREIGN KEY ("subTagId") REFERENCES "SubTag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
