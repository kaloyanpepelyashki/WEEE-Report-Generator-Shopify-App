-- CreateTable
CREATE TABLE "UserSession" (
    "userId" BIGINT NOT NULL PRIMARY KEY,
    "isOnBoarded" BOOLEAN NOT NULL DEFAULT false
);
