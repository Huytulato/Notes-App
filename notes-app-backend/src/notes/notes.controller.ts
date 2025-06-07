import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common'; import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Bảo vệ tất cả các route trong controller này
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @Req() req) {
    const userId = req.user.userId; // Lấy userId từ payload của token
    return this.notesService.create(createNoteDto, userId);
  }

  @Get()
  findAll(@Req() req, @Query('search') searchTerm?: string) { // <-- Thêm @Query
    const userId = req.user.userId;
    if (searchTerm) {
      // Nếu có query 'search', gọi hàm tìm kiếm
      return this.notesService.searchForUser(userId, searchTerm);
    } else {
      // Nếu không, lấy tất cả notes như cũ
      return this.notesService.findAllForUser(userId);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.notesService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Req() req) {
    const userId = req.user.userId;
    return this.notesService.update(id, updateNoteDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.userId;
    return this.notesService.remove(id, userId);
  }
}