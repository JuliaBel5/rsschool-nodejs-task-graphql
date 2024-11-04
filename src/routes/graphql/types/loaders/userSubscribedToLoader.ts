import DataLoader from 'dataloader';
import { PrismaClient } from '.prisma/client';
import { UUID } from 'crypto';

export const userSubscribedToLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids: readonly UUID[]) => {
    const users = await prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: { in: ids as UUID[] },
          },
        },
      },
    });
    return ids.map(() => users);
  });
};
