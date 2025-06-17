import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';
import * as marked from 'marked';

// Tạo các interface để định nghĩa hình dạng của input
interface NoteInput {
  title: string;
  content: string;
}

interface UpdateNoteInput {
  title?: string;
  content?: string;
}
@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async create(noteInput: NoteInput, userId: string): Promise<Note> {
    const contentHtml = marked.parse(noteInput.content);
    const newNote = new this.noteModel({
      ...noteInput,
      contentHtml,
      author: userId,
    });
    return newNote.save();
  }

  async findAllForUser(userId: string): Promise<Note[]> {
    return this.noteModel.find({ author: userId }).sort({ createdAt: -1 }).exec();
  }

  async searchForUser(userId: string, searchTerm: string): Promise<Note[]> {
    // Tạo một biểu thức chính quy (regular expression) để tìm kiếm không phân biệt chữ hoa/thường
    const searchRegex = new RegExp(searchTerm, 'i');

    return this.noteModel.find({
      author: userId, // Chỉ tìm trong các note của user này
      $or: [ // Tìm ở một trong hai trường sau
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
      ],
    }).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.noteModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
    if (note.author.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to access this note');
    }
    return note;
  }

  async update(id: string, updateNoteInput: UpdateNoteInput, userId: string): Promise<Note> {
    const noteToUpdate: any = { ...updateNoteInput };

    if (updateNoteInput.content) {
      noteToUpdate.contentHtml = marked.parse(updateNoteInput.content);
    }

    const updatedNote = await this.noteModel.findOneAndUpdate(
      { _id: id, author: userId },
      noteToUpdate,
      { new: true },
    ).exec();

    if (!updatedNote) {
      throw new NotFoundException(`Note with ID "${id}" not found or you don't have permission`);
    }
    return updatedNote;
  }

  async remove(id: string, userId: string): Promise<{ deleted: boolean }> {
    const result = await this.noteModel.deleteOne({ _id: id, author: userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Note with ID "${id}" not found or you don't have permission`);
    }
    return { deleted: true };
  }
}