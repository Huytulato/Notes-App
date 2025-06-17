// src/auth/types/auth.type.ts

import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from '../../users/types/user.type';

@ObjectType('AuthPayload')
export class AuthType {
  @Field(() => UserType)
  user: UserType;

  @Field()
  access_token: string;
}