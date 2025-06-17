import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthType } from './types/auth.type';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { UserType } from '../users/types/user.type';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthType)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => UserType) // Khi đăng ký, chỉ trả về thông tin user
  async register(@Args('registerInput') registerInput: RegisterInput) {
    const user = await this.authService.register(registerInput);
    // Loại bỏ password trước khi trả về
    const { password, ...result } = (user as any).toObject();
    return result;
  }
}