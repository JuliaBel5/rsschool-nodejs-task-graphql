import DataLoader from 'dataloader';
import { PrismaClient } from '.prisma/client';

export const membersLoader = (prisma: PrismaClient) => {
  return new DataLoader(async (ids) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        id: {
          in: ids as string[],
        },
      },
    });
    return ids.map((id) => memberTypes.find((memberType) => memberType.id === id));
  });
};
