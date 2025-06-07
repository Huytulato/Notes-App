import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Note extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string; // Nội dung Markdown gốc

  @Prop({ required: true })
  contentHtml: string; // Nội dung đã chuyển sang HTML

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: User;
}

export const NoteSchema = SchemaFactory.createForClass(Note);