import { ObjectType, Field, ID} from "@nestjs/graphql";
import {UserType} from "../../users/types/user.type";

@ObjectType('Note')
export class NoteType {
    @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  contentHtml: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Định nghĩa mối quan hệ
  @Field(() => UserType)
  author: UserType;
}