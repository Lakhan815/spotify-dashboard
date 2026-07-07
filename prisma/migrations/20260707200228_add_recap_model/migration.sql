-- CreateTable
CREATE TABLE "Recap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackCaption" TEXT NOT NULL,
    "artistCaption" TEXT NOT NULL,
    "datePosted" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recap" ADD CONSTRAINT "Recap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
