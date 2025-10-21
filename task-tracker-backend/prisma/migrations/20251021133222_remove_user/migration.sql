/*
  Warnings:

  - You are about to drop the column `userId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_userId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."User";

-- CreateIndex
CREATE UNIQUE INDEX "Task_user_id_key" ON "Task"("user_id");
