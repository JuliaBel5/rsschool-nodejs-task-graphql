import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import {
  CreatePostInput,
  CreateUserInput,
  CreateProfileInput,
  ChangePostInput,
  ChangeUserInput,
  ChangeProfileInput,
} from '../types/inputs.js';
import {
  PostType,
  UserType,
  ProfileType,
  GqlContext,
  ICreatePost,
  ICreateUser,
  ICreateProfile,
} from '../types/types.js';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createPost: {
      type: PostType,
      args: {
        dto: { type: CreatePostInput },
      },
      async resolve(_, { dto }: { dto: ICreatePost }, context: GqlContext) {
        return context.prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (
        _,
        { id, dto }: { id: string; dto: ICreatePost },
        context: GqlContext,
      ) => {
        return context.prisma.post.update({ where: { id }, data: dto });
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: GqlContext) => {
        try {
          await context.prisma.post.delete({ where: { id } });
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },
    },

    // User Mutations
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (_, { dto }: { dto: ICreateUser }, context: GqlContext) => {
        return context.prisma.user.create({ data: dto });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (
        _,
        { id, dto }: { id: string; dto: ICreateUser },
        context: GqlContext,
      ) => {
        return context.prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context: GqlContext) => {
        await context.prisma.user.delete({ where: { id } });
        return true;
      },
    },
    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context: GqlContext,
      ) => {
        await context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId: authorId,
          },
        });
        return context.prisma.user.findUnique({
          where: { id: userId },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context: GqlContext,
      ) => {
        await context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: { subscriberId: userId, authorId },
          },
        });
        return true;
      },
    },

    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: CreateProfileInput },
      },
      resolve: async (_, { dto }: { dto: ICreateProfile }, context: GqlContext) => {
        return context.prisma.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: ChangeProfileInput },
      },
      resolve: async (
        _,
        { id, dto }: { id: string; dto: Partial<ICreateProfile> },
        context: GqlContext,
      ) => {
        return context.prisma.profile.update({ where: { id }, data: dto });
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_, { id }: { id: string }, context: GqlContext) => {
        try {
          await context.prisma.profile.delete({ where: { id } });
          return true;
        } catch (err) {
          console.error(err);
          return false;
        }
      },
    },
  },
});
