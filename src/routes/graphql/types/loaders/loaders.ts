import { userLoader } from './userLoader.js';
import { profileIdLoader, profileLoader } from './profileLoader.js';
import { PrismaClient } from '.prisma/client';
import { membersLoader } from './membersLoader.js';
import { postLoader, postsLoader } from './postsLoader.js';
import { subscribedToUserLoader } from './subscribedToUserLoader.js';
import { userSubscribedToLoader } from './userSubscribedToLoader.js';

export const gqlLoaders = (prisma: PrismaClient) => ({
  userLoader: userLoader(prisma),
  profileLoader: profileLoader(prisma),
  profileIdLoader: profileIdLoader(prisma),
  membersLoader: membersLoader(prisma),
  postsLoader: postsLoader(prisma),
  postLoader: postLoader(prisma),
  subscribedToUserLoader: subscribedToUserLoader(prisma),
  userSubscribedToLoader: userSubscribedToLoader(prisma),
});
