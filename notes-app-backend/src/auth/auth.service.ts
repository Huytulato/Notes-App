import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { User } from '../users/schemas/user.schema';
import { AuthType } from './types/auth.type';

// Tạo một kiểu mới để bao gồm cả _id
type ValidatedUser = Omit<User, 'password'> & { _id: any };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerInput: RegisterInput) {
    const existingUser = await this.usersService.findByEmail(registerInput.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    return this.usersService.create(registerInput);
  }

  async login(loginInput: LoginInput): Promise<AuthType> {
    const user = await this.usersService.findByEmail(loginInput.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(loginInput.password, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const payload = { email: user.email, sub: user._id.toString() };
    const token = this.jwtService.sign(payload);

    // Trả về đối tượng khớp với AuthType
    return {
      user: {
        ...(user as any).toObject?.() ?? { ...user },
        _id: user._id.toString(),
      },
      access_token: token,
    };
  }
}