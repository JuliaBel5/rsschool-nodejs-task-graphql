import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PrismaClient } from '@prisma/client';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

export type GqlContext = {
  prisma: PrismaClient;
};

export const UserType: GraphQLObjectType<{ id: string }, GqlContext> =
  new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: UUIDType },
      name: { type: GraphQLString },
      balance: { type: GraphQLFloat },
      profile: {
        type: ProfileType,
        resolve: async (parent: { id: string }, _, context: GqlContext) => {
          // Получение профиля пользователя через Prisma
          return await context.prisma.profile.findUnique({
            where: { userId: parent.id },
          });
        },
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: async (parent: { id: string }, _, context: GqlContext) => {
          // Получение постов пользователя через Prisma
          return await context.prisma.post.findMany({
            where: { authorId: parent.id },
          });
        },
      },
      userSubscribedTo: {
        type: new GraphQLList(UserType),
        resolve: async (parent: { id: string }, _, context: GqlContext) => {
          // Получение пользователей, на которых подписан данный пользователь через Prisma
          const subscriptions = await context.prisma.subscribersOnAuthors.findMany({
            where: { subscriberId: parent.id },
            include: { author: true },
          });
          return subscriptions.map((sub) => sub.author);
        },
      },
      subscribedToUser: {
        type: new GraphQLList(UserType),
        resolve: async (parent: { id: string }, _, context: GqlContext) => {
          // Получение пользователей, которые подписаны на данного пользователя через Prisma
          const subscribers = await context.prisma.user.findMany({
            where: {
              userSubscribedTo: {
                some: {
                  authorId: parent.id,
                },
              },
            },
          });
          return subscribers;
        },
      },
    }),
  });

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  }),
});

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: GraphQLString },
    memberType: {
      type: MemberType,
      resolve: async (parent: { memberTypeId: string }, _, context: GqlContext) => {
        return await context.prisma.memberType.findUnique({
          where: { id: parent.memberTypeId },
        });
      },
    },
  }),
});
export enum MemberTypeIdType {
  BASIC = 'BASIC',
  BUSINESS = 'BUSINESS',
}

export interface ICreateProfile {
  userId: string;
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export interface ICreatePost {
  title: string;
  content: string;
  authorId: string;
}

export interface ICreateUser {
  name: string;
  balance: number;
}
