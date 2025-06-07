import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật CORS để frontend có thể gọi API
  app.enableCors();

  // Thêm tiền tố /api cho tất cả các route
  app.setGlobalPrefix('api');

  // Sử dụng ValidationPipe toàn cục để tự động validate DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động loại bỏ các thuộc tính không được định nghĩa trong DTO
    transform: true, // Tự động chuyển đổi payload sang kiểu DTO
  }));

  await app.listen(3001); // Chạy server ở port 3001
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();