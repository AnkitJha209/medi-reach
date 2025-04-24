/*
  Warnings:

  - You are about to drop the column `bloodGroup` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `forSelf` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `patientAge` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `friend` on the `User` table. All the data in the column will be lost.
  - Added the required column `patientId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_userId_fkey";

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ORGANIZATION';

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "bloodGroup",
DROP COLUMN "forSelf",
DROP COLUMN "patientAge",
DROP COLUMN "patientName",
DROP COLUMN "userId",
ADD COLUMN     "patientId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "friend",
ADD COLUMN     "password" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "bloodGroup" TEXT,
    "isSelf" BOOLEAN NOT NULL DEFAULT true,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phoneNumber_key" ON "Patient"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
