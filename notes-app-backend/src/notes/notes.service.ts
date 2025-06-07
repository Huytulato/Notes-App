import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from './schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import * as marked from 'marked';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const contentHtml = marked.parse(createNoteDto.content);
    const newNote = new this.noteModel({
      ...createNoteDto,
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

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    const noteToUpdate = { ...updateNoteDto };

    // Nếu có nội dung mới, chuyển đổi nó sang HTML
    if (updateNoteDto.content) {
      noteToUpdate['contentHtml'] = marked.parse(updateNoteDto.content);
    }

    const updatedNote = await this.noteModel.findOneAndUpdate(
      { _id: id, author: userId }, // Đảm bảo chỉ user sở hữu mới có thể update
      noteToUpdate,
      { new: true }, // Trả về document đã được update
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