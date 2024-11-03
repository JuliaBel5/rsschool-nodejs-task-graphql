import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLNonNull,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeId } from './types.js';

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  },
});

export const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(UUIDType) }, // ID пользователя
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) }, // Пол
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) }, // Год рождения
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) }, // ID типа участника
  },
});

// ChangeProfileInput - структура для изменения профиля
export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean }, // Пол, может быть опциональным
    yearOfBirth: { type: GraphQLInt }, // Год рождения, может быть опциональным
    memberTypeId: { type: MemberTypeId }, // ID типа участника, может быть опциональным
  },
});
