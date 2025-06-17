import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; 

@Schema()
export class User{ 
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // Thêm trường role nếu có kế hoạch làm trang admin
  @Prop({ type: String, enum: ['user', 'admin'], default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);