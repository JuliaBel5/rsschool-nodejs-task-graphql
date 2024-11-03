import { GraphQLNonNull, GraphQLList, GraphQLObjectType } from 'graphql';
import {
  PostType,
  UserType,
  ProfileType,
  GqlContext,
  MemberType,
  MemberTypeId,
  MemberTypeIdType,
} from './types/types.js';
import { UUIDType } from './types/uuid.js';

import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_, __, context: GqlContext, info) => {
        const resolveTree = parseResolveInfo(info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          resolveTree,
          info.returnType,
        );
        const include: { subscribedToUser?: boolean; userSubscribedTo?: boolean } = {};

        if ('subscribedToUser' in fields) {
          include.subscribedToUser = true;
        }

        if ('userSubscribedTo' in fields) {
          include.userSubscribedTo = true;
        }

        return await context.prisma.user.findMany({ include });
      },
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id: userId }: { id: string }, context: GqlContext) => {
        return await context.prisma.user.findUnique({
          where: { id: userId },
        });
      },
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_, __, context: GqlContext) => {
        return await context.prisma.profile.findMany();
      },
    },

    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id: profileId }: { id: string }, context: GqlContext) => {
        return await context.prisma.profile.findUnique({
          where: { id: profileId },
        });
      },
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_, __, context: GqlContext) => {
        return context.prisma.post.findMany();
      },
    },

    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id: postId }: { id: string }, context: GqlContext) => {
        return context.prisma.post.findUnique({
          where: { id: postId },
        });
      },
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_, __, context: GqlContext) => {
        return await context.prisma.memberType.findMany();
      },
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId) },
      },
      resolve: async (
        _,
        { id: MemberTypeIdType }: { id: MemberTypeIdType },
        context: GqlContext,
      ) => {
        return await context.prisma.memberType.findUnique({
          where: {
            id: MemberTypeIdType,
          },
        });
      },
    },
  },
});
