import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';
import { NotesResolver } from './notes.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    UsersModule,
  ],
  providers: [NotesResolver, NotesService],
})
export class NotesModule {}