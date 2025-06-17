import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteType } from './types/note.type';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { UserType } from '../users/types/user.type';

@Resolver(() => NoteType) // Nói rằng resolver này chịu trách nhiệm cho NoteType
export class NotesResolver {
  constructor(
    private notesService: NotesService,
    private usersService: UsersService, // Cần để resolve field 'author'
  ) {}

  // Query để lấy tất cả ghi chú của người dùng hiện tại
  @Query(() => [NoteType])
  @UseGuards(GqlAuthGuard) // Bảo vệ query này
  async myNotes(@CurrentUser() user: User) {
    return this.notesService.findAllForUser(user._id.toString());
  }

  // Query để lấy một ghi chú theo ID
  @Query(() => NoteType)
  @UseGuards(GqlAuthGuard)
  async note(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.notesService.findOne(id, user._id.toString());
  }

  @Query(() => [NoteType], { name: 'searchNotes' }) // Đặt tên cho query là 'searchNotes'
  @UseGuards(GqlAuthGuard)
  async searchUserNotes(
    @Args('searchTerm') searchTerm: string,
    @CurrentUser() user: User,
  ) {
    // Tái sử dụng hàm searchForUser đã có trong service
    return this.notesService.searchForUser(user._id.toString(), searchTerm);
  }
  
  // Mutation để tạo một ghi chú mới
  @Mutation(() => NoteType)
  @UseGuards(GqlAuthGuard)
  async createNote(
    @Args('title') title: string,
    @Args('content') content: string,
    @CurrentUser() user: User,
  ) {
    return this.notesService.create({ title, content }, user._id.toString());
  }

  // Mutation để cập nhật ghi chú
  @Mutation(() => NoteType)
  @UseGuards(GqlAuthGuard)
  async updateNote(
    @Args('id', { type: () => ID }) id: string,
    @Args('title', { nullable: true }) title: string,
    @Args('content', { nullable: true }) content: string,
    @CurrentUser() user: User,
  ) {
    return this.notesService.update(id, { title, content }, user._id.toString());
  }

  // Mutation để xóa ghi chú
  @Mutation(() => Boolean) // Trả về true nếu thành công
  @UseGuards(GqlAuthGuard)
  async deleteNote(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    await this.notesService.remove(id, user._id.toString());
    return true;
  }

  // Resolver cho trường 'author' của NoteType
  // Khi GraphQL thấy trường 'author' trong một query, nó sẽ gọi hàm này
  @ResolveField('author', () => UserType)
  async getAuthor(@Parent() note: NoteType) {
    // note.author lúc này chỉ là một ID, chúng ta cần lấy đầy đủ thông tin user
    return this.usersService.findById(note.author as any);
  }
}