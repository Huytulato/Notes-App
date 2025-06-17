import { ObjectType, Field, ID } from "@nestjs/graphql";
import { NoteType } from "src/notes/types/note.type";
@ObjectType('User')
export class UserType {
  @Field(() => ID) 
  _id: string;

  @Field()
  email: string;

  @Field(() => [NoteType], { nullable: 'itemsAndList' })
  notes?: NoteType[];
}