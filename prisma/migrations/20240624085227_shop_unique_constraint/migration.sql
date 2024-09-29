/*
  Warnings:

  - A unique constraint covering the columns `[shop]` on the table `ShopOnBoardingSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ShopOnBoardingSession_shop_key" ON "ShopOnBoardingSession"("shop");
