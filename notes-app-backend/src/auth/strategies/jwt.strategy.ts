import { Injectable, UnauthorizedException } from '@nestjs/common'; // Thêm UnauthorizedException
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      // Ném lỗi ngay lập tức nếu không tìm thấy secret key
      // Điều này giúp ứng dụng không khởi động với một cấu hình bảo mật yếu.
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Bây giờ 'secret' chắc chắn là một string
    });
  }

  // Payload sau khi được giải mã từ token
  async validate(payload: any) {
    // NestJS sẽ tự động gán giá trị trả về này vào req.user
    return { userId: payload.sub, email: payload.email };
  }
}